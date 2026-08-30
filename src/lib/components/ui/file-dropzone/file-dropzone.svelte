<script module lang="ts">
	export type FileUploadStatus = 'idle' | 'uploading' | 'complete' | 'error' | 'cancelled';

	export type FileDropzoneItem = {
		id: string;
		file: File;
		progress: number;
		status: FileUploadStatus;
		error?: string;
	};

	export type FileRejectionReason = 'type' | 'size' | 'count' | 'duplicate';

	export type FileRejection = {
		file: File;
		reason: FileRejectionReason;
		message: string;
	};

	export type FileUploadContext = {
		onProgress: (progress: number) => void;
		signal: AbortSignal;
	};

	export type FileUploader = (file: File, context: FileUploadContext) => Promise<void>;

	export function formatFileSize(bytes: number) {
		if (bytes === 0) return '0 B';
		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
		const value = bytes / 1024 ** index;
		return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
	}
</script>

<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import FileIcon from '@lucide/svelte/icons/file';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils.js';

	type FileDropzoneProps = {
		files?: File[];
		onFilesChange?: (files: File[]) => void;
		onUpload?: FileUploader;
		onUploadComplete?: (file: File) => void;
		onUploadError?: (file: File, error: Error) => void;
		onReject?: (rejections: FileRejection[]) => void;
		autoUpload?: boolean;
		name?: string;
		accept?: string;
		multiple?: boolean;
		maxFiles?: number;
		maxFileSize?: number;
		disabled?: boolean;
		dropLabel?: string;
		browseLabel?: string;
		class?: string;
		dropzoneClass?: string;
		listClass?: string;
		inputProps?: Omit<
			HTMLInputAttributes,
			'type' | 'files' | 'value' | 'name' | 'accept' | 'multiple' | 'disabled' | 'oninput' | 'class'
		>;
	};

	let {
		files = $bindable([]),
		onFilesChange,
		onUpload,
		onUploadComplete,
		onUploadError,
		onReject,
		autoUpload = false,
		name,
		accept,
		multiple = true,
		maxFiles = Number.POSITIVE_INFINITY,
		maxFileSize,
		disabled = false,
		dropLabel = 'Drop files here',
		browseLabel = 'or choose files',
		class: className,
		dropzoneClass,
		listClass,
		inputProps
	}: FileDropzoneProps = $props();

	const componentId = $props.id();
	const inputId = `${componentId}-input`;
	const rejectionId = `${componentId}-rejection`;
	let itemCounter = 0;
	let fileInput = $state<HTMLInputElement | null>(null);
	let dragging = $state(false);
	let rejectionMessage = $state('');
	let editingId = $state<string | null>(null);
	let renameValue = $state('');
	let items = $state<FileDropzoneItem[]>(files.map(createItem));
	const controllers = new SvelteMap<string, AbortController>();
	const uploading = $derived(items.some((item) => item.status === 'uploading'));
	const canUpload = $derived(
		Boolean(onUpload) && items.some((item) => ['idle', 'error', 'cancelled'].includes(item.status))
	);

	onMount(() => syncNativeInput(files));

	function createItem(file: File): FileDropzoneItem {
		return {
			id: `${componentId}-file-${itemCounter++}`,
			file,
			progress: 0,
			status: 'idle'
		};
	}

	function syncNativeInput(nextFiles: File[]) {
		if (!fileInput || typeof DataTransfer === 'undefined') return;

		const transfer = new DataTransfer();
		for (const file of nextFiles) transfer.items.add(file);
		fileInput.files = transfer.files;
	}

	function commit(nextItems: FileDropzoneItem[]) {
		items = nextItems;
		files = nextItems.map((item) => item.file);
		syncNativeInput(files);
		onFilesChange?.(files);
	}

	function matchesAccept(file: File) {
		if (!accept) return true;

		return accept.split(',').some((rule) => {
			const value = rule.trim().toLowerCase();
			if (!value) return false;
			if (value.startsWith('.')) return file.name.toLowerCase().endsWith(value);
			if (value.endsWith('/*')) return file.type.toLowerCase().startsWith(value.slice(0, -1));
			return file.type.toLowerCase() === value;
		});
	}

	function rejectionFor(file: File, reason: FileRejectionReason): FileRejection {
		const messages: Record<FileRejectionReason, string> = {
			type: `${file.name} is not an accepted file type.`,
			size: `${file.name} is larger than ${formatFileSize(maxFileSize ?? 0)}.`,
			count: `Only ${maxFiles} file${maxFiles === 1 ? '' : 's'} can be added.`,
			duplicate: `${file.name} has already been added.`
		};
		return { file, reason, message: messages[reason] };
	}

	function addFiles(incoming: File[]) {
		if (disabled || incoming.length === 0) return;

		const acceptedItems: FileDropzoneItem[] = [];
		const rejections: FileRejection[] = [];
		const existing = new SvelteSet(
			items.map(({ file }) => `${file.name}:${file.size}:${file.lastModified}`)
		);
		const limit = multiple ? maxFiles : 1;

		for (const file of incoming) {
			const signature = `${file.name}:${file.size}:${file.lastModified}`;
			if (existing.has(signature)) {
				rejections.push(rejectionFor(file, 'duplicate'));
			} else if (!matchesAccept(file)) {
				rejections.push(rejectionFor(file, 'type'));
			} else if (maxFileSize !== undefined && file.size > maxFileSize) {
				rejections.push(rejectionFor(file, 'size'));
			} else if ((multiple ? items.length : 0) + acceptedItems.length >= limit) {
				rejections.push(rejectionFor(file, 'count'));
			} else {
				const item = createItem(file);
				acceptedItems.push(item);
				existing.add(signature);
			}
		}

		const baseItems = multiple ? items : [];
		commit([...baseItems, ...acceptedItems]);
		rejectionMessage = rejections[0]?.message ?? '';
		if (rejections.length) onReject?.(rejections);

		if (autoUpload && onUpload) {
			for (const item of acceptedItems) void uploadItem(item.id);
		}
	}

	function handleSelection(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		addFiles(Array.from(input.files ?? []));
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		addFiles(Array.from(event.dataTransfer?.files ?? []));
	}

	function updateItem(id: string, update: Partial<FileDropzoneItem>) {
		items = items.map((item) => (item.id === id ? { ...item, ...update } : item));
	}

	function removeItem(id: string) {
		controllers.get(id)?.abort();
		controllers.delete(id);
		if (editingId === id) editingId = null;
		commit(items.filter((item) => item.id !== id));
	}

	function clearFiles() {
		for (const controller of controllers.values()) controller.abort();
		controllers.clear();
		editingId = null;
		rejectionMessage = '';
		commit([]);
	}

	function beginRename(item: FileDropzoneItem) {
		editingId = item.id;
		renameValue = item.file.name;
	}

	function saveRename(event: SubmitEvent, item: FileDropzoneItem) {
		event.preventDefault();
		const nextName = renameValue.trim();
		if (!nextName || nextName === item.file.name) {
			editingId = null;
			return;
		}

		const renamedFile = new File([item.file], nextName, {
			type: item.file.type,
			lastModified: item.file.lastModified
		});
		commit(
			items.map((entry) =>
				entry.id === item.id
					? { ...entry, file: renamedFile, progress: 0, status: 'idle', error: undefined }
					: entry
			)
		);
		editingId = null;
	}

	async function uploadItem(id: string) {
		const item = items.find((entry) => entry.id === id);
		if (!item || !onUpload || item.status === 'uploading') return;

		const controller = new AbortController();
		controllers.set(id, controller);
		updateItem(id, { progress: 0, status: 'uploading', error: undefined });

		try {
			await onUpload(item.file, {
				signal: controller.signal,
				onProgress: (progress) => {
					updateItem(id, { progress: Math.min(100, Math.max(0, progress)) });
				}
			});

			if (controller.signal.aborted) {
				updateItem(id, { status: 'cancelled' });
				return;
			}

			updateItem(id, { progress: 100, status: 'complete' });
			onUploadComplete?.(item.file);
		} catch (cause) {
			if (controller.signal.aborted) {
				updateItem(id, { status: 'cancelled' });
				return;
			}

			const uploadError = cause instanceof Error ? cause : new Error('Upload failed.');
			updateItem(id, { status: 'error', error: uploadError.message });
			onUploadError?.(item.file, uploadError);
		} finally {
			controllers.delete(id);
		}
	}

	async function uploadAll() {
		const uploadable = items.filter((item) => ['idle', 'error', 'cancelled'].includes(item.status));
		await Promise.all(uploadable.map((item) => uploadItem(item.id)));
	}
</script>

<div data-slot="file-dropzone" class={cn('grid gap-4', className)}>
	<Input
		{...inputProps}
		bind:ref={fileInput}
		id={inputId}
		type="file"
		{name}
		{accept}
		{multiple}
		{disabled}
		oninput={handleSelection}
		class="sr-only"
	/>

	<button
		type="button"
		{disabled}
		aria-describedby={rejectionMessage ? rejectionId : undefined}
		onclick={() => fileInput?.click()}
		ondragenter={(event) => {
			event.preventDefault();
			if (!disabled) dragging = true;
		}}
		ondragover={(event) => event.preventDefault()}
		ondragleave={() => (dragging = false)}
		ondrop={handleDrop}
		class={cn(
			'grid min-h-40 w-full place-items-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center transition-colors outline-none hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
			dragging && 'border-primary bg-primary/5',
			dropzoneClass
		)}
	>
		<span class="grid justify-items-center gap-2">
			<span
				class="grid size-10 place-items-center rounded-full border border-border bg-background shadow-xs"
			>
				<UploadIcon class="size-4 text-muted-foreground" aria-hidden="true" />
			</span>
			<span class="text-sm font-medium text-foreground">{dropLabel}</span>
			<span class="text-xs text-muted-foreground">{browseLabel}</span>
		</span>
	</button>

	{#if rejectionMessage}
		<p id={rejectionId} class="text-xs text-destructive" role="alert">{rejectionMessage}</p>
	{/if}

	{#if items.length}
		<div class="flex items-center justify-between gap-3">
			<p class="text-sm font-medium text-foreground">
				{items.length} file{items.length === 1 ? '' : 's'}
			</p>
			<div class="flex items-center gap-1">
				{#if onUpload}
					<Button size="sm" onclick={uploadAll} disabled={!canUpload || uploading}>
						{#if uploading}<LoaderCircleIcon class="animate-spin" aria-hidden="true" />{/if}
						Upload all
					</Button>
				{/if}
				<Button variant="ghost" size="sm" onclick={clearFiles} {disabled}>Clear</Button>
			</div>
		</div>

		<ul class={cn('grid gap-2', listClass)} aria-label="Selected files">
			{#each items as item (item.id)}
				<li class="rounded-xl border border-border bg-background p-3 shadow-xs">
					<div class="flex min-w-0 items-center gap-3">
						<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
							<FileIcon class="size-4 text-muted-foreground" aria-hidden="true" />
						</span>

						<div class="min-w-0 flex-1">
							{#if editingId === item.id}
								<form class="flex items-center gap-1" onsubmit={(event) => saveRename(event, item)}>
									<Input
										bind:value={renameValue}
										aria-label={`Rename ${item.file.name}`}
										class="h-7"
									/>
									<Button type="submit" variant="ghost" size="icon-sm" aria-label="Save filename">
										<CheckIcon aria-hidden="true" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										aria-label="Cancel rename"
										onclick={() => (editingId = null)}
									>
										<XIcon aria-hidden="true" />
									</Button>
								</form>
							{:else}
								<p class="truncate text-sm font-medium text-foreground" title={item.file.name}>
									{item.file.name}
								</p>
								<p class="mt-0.5 text-xs text-muted-foreground">
									{formatFileSize(item.file.size)}
									{#if item.status === 'complete'}
										· Uploaded{/if}
									{#if item.status === 'cancelled'}
										· Cancelled{/if}
								</p>
							{/if}
						</div>

						{#if editingId !== item.id}
							<div class="flex shrink-0 items-center gap-1">
								{#if onUpload && item.status !== 'complete' && item.status !== 'uploading'}
									<Button
										variant="ghost"
										size="icon-sm"
										{disabled}
										aria-label={item.status === 'error'
											? `Retry ${item.file.name}`
											: `Upload ${item.file.name}`}
										onclick={() => uploadItem(item.id)}
									>
										{#if item.status === 'error'}
											<RotateCcwIcon aria-hidden="true" />
										{:else}
											<UploadIcon aria-hidden="true" />
										{/if}
									</Button>
								{/if}
								<Button
									variant="ghost"
									size="icon-sm"
									disabled={disabled || item.status === 'uploading'}
									aria-label={`Rename ${item.file.name}`}
									onclick={() => beginRename(item)}
								>
									<PencilIcon aria-hidden="true" />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									{disabled}
									aria-label={`Remove ${item.file.name}`}
									onclick={() => removeItem(item.id)}
								>
									<XIcon aria-hidden="true" />
								</Button>
							</div>
						{/if}
					</div>

					{#if item.status === 'uploading' || item.status === 'complete'}
						<div class="mt-3 flex items-center gap-2">
							<div
								class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
								role="progressbar"
								aria-label={`Upload progress for ${item.file.name}`}
								aria-valuemin="0"
								aria-valuemax="100"
								aria-valuenow={Math.round(item.progress)}
							>
								<div
									class="h-full rounded-full bg-primary transition-[width]"
									style:width={`${item.progress}%`}
								></div>
							</div>
							<span class="w-9 text-right text-xs text-muted-foreground tabular-nums">
								{Math.round(item.progress)}%
							</span>
						</div>
					{/if}

					{#if item.error}
						<p class="mt-2 text-xs text-destructive" role="alert">{item.error}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
