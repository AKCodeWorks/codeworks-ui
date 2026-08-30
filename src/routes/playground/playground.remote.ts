import { env } from '$env/dynamic/private';
import { form, query } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { assertPlaygroundEnabled } from './playground.server';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 15 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'text/plain']);
const ACCEPTED_EXTENSIONS: Record<string, string[]> = {
	'application/pdf': ['.pdf'],
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'text/plain': ['.txt']
};

type PlaygroundUploadInput = {
	uploads: File[];
};

function hasExpectedSignature(file: File, bytes: Uint8Array) {
	switch (file.type) {
		case 'application/pdf':
			return bytes.length >= 5 && new TextDecoder().decode(bytes.subarray(0, 5)) === '%PDF-';
		case 'image/jpeg':
			return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
		case 'image/png':
			return (
				bytes.length >= 8 &&
				bytes[0] === 0x89 &&
				bytes[1] === 0x50 &&
				bytes[2] === 0x4e &&
				bytes[3] === 0x47 &&
				bytes[4] === 0x0d &&
				bytes[5] === 0x0a &&
				bytes[6] === 0x1a &&
				bytes[7] === 0x0a
			);
		case 'text/plain':
			return !bytes.subarray(0, 512).includes(0);
		default:
			return false;
	}
}

function toHex(buffer: ArrayBuffer) {
	return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const getPlaygroundStatus = query(() => {
	assertPlaygroundEnabled();

	return {
		environment: env.NODE_ENV ?? 'development',
		serverTime: new Date().toISOString(),
		message: 'Remote functions are available.'
	};
});

export const uploadPlaygroundFiles = form<
	PlaygroundUploadInput,
	{
		uploadedAt: string;
		totalBytes: number;
		files: Array<{ name: string; size: number; type: string; sha256: string }>;
	}
>('unchecked', async ({ uploads }, issue) => {
	assertPlaygroundEnabled();

	const rawUploads = uploads as File | File[] | undefined;
	const files = rawUploads ? (Array.isArray(rawUploads) ? rawUploads : [rawUploads]) : [];
	const issues: ReturnType<typeof issue.uploads>[] = [];

	if (files.length === 0) issues.push(issue.uploads('Choose at least one file.'));
	if (files.length > MAX_FILES)
		issues.push(issue.uploads(`Upload no more than ${MAX_FILES} files.`));

	const totalBytes = files.reduce((total, file) => total + file.size, 0);
	if (totalBytes > MAX_TOTAL_SIZE) {
		issues.push(issue.uploads('The combined upload must be 15 MB or smaller.'));
	}

	for (const file of files) {
		if (file.size === 0) {
			issues.push(issue.uploads(`${file.name} is empty.`));
		} else if (file.size > MAX_FILE_SIZE) {
			issues.push(issue.uploads(`${file.name} must be 5 MB or smaller.`));
		}

		if (!file.name.trim() || /[\\/\0]/.test(file.name)) {
			issues.push(issue.uploads('A filename contains unsupported characters.'));
		}

		if (!ACCEPTED_TYPES.has(file.type)) {
			issues.push(issue.uploads(`${file.name} has an unsupported media type.`));
		} else if (
			!ACCEPTED_EXTENSIONS[file.type].some((extension) =>
				file.name.toLowerCase().endsWith(extension)
			)
		) {
			issues.push(
				issue.uploads(`${file.name} does not use an extension allowed for ${file.type}.`)
			);
		}
	}

	if (issues.length) invalid(...issues);

	const uploaded = await Promise.all(
		files.map(async (file) => {
			const buffer = await file.arrayBuffer();
			const bytes = new Uint8Array(buffer);

			if (!hasExpectedSignature(file, bytes)) {
				invalid(issue.uploads(`${file.name} does not match its declared media type.`));
			}

			return {
				name: file.name,
				size: file.size,
				type: file.type,
				sha256: toHex(await crypto.subtle.digest('SHA-256', buffer))
			};
		})
	);

	return {
		uploadedAt: new Date().toISOString(),
		totalBytes,
		files: uploaded
	};
});
