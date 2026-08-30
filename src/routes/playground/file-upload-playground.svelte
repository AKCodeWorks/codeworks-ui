<script lang="ts">
	import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import { Button } from '$lib/components/ui/button';
	import { FileDropzone, formatFileSize } from '$lib/components/ui/file-dropzone';
	import { uploadPlaygroundFiles } from './playground.remote';

	let files = $state<File[]>([]);
	const input = $derived(uploadPlaygroundFiles.fields.uploads.as('file multiple'));
	const issues = $derived(uploadPlaygroundFiles.fields.uploads.issues() ?? []);
</script>

<form {...uploadPlaygroundFiles} enctype="multipart/form-data" class="w-full max-w-2xl space-y-4">
	<FileDropzone
		bind:files
		name={input.name}
		accept="application/pdf,image/jpeg,image/png,text/plain"
		maxFiles={5}
		maxFileSize={5 * 1024 * 1024}
		inputProps={{
			required: true,
			'aria-invalid': issues.length > 0,
			'aria-describedby': issues.length ? 'playground-upload-errors' : undefined
		}}
		dropLabel="Upload files to the development server"
		browseLabel="PDF, JPEG, PNG, or text · 5 files · 5 MB each"
	/>

	{#if issues.length}
		<ul id="playground-upload-errors" class="space-y-1 text-sm text-destructive" aria-live="polite">
			{#each issues as issue, index (`${issue.message}-${index}`)}
				<li>{issue.message}</li>
			{/each}
		</ul>
	{/if}

	<div class="flex flex-wrap items-center gap-3">
		<Button type="submit" disabled={!files.length || uploadPlaygroundFiles.pending > 0}>
			{#if uploadPlaygroundFiles.pending > 0}
				<LoaderCircleIcon class="animate-spin" aria-hidden="true" />
				Uploading to server…
			{:else}
				Upload with remote form
			{/if}
		</Button>
		<p class="text-xs text-muted-foreground">
			The server reads every byte and validates the files without persisting them.
		</p>
	</div>

	{#if uploadPlaygroundFiles.result}
		<section
			class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"
			aria-live="polite"
		>
			<div
				class="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-500"
			>
				<CheckCircleIcon class="size-4" aria-hidden="true" />
				Server accepted {uploadPlaygroundFiles.result.files.length} file{uploadPlaygroundFiles
					.result.files.length === 1
					? ''
					: 's'} ({formatFileSize(uploadPlaygroundFiles.result.totalBytes)})
			</div>
			<ul class="mt-3 grid gap-2">
				{#each uploadPlaygroundFiles.result.files as file, index (`${file.sha256}-${file.name}-${index}`)}
					<li class="rounded-lg border border-border bg-background px-3 py-2 text-xs">
						<div class="flex flex-wrap items-center justify-between gap-2">
							<span class="font-medium text-foreground">{file.name}</span>
							<span class="text-muted-foreground">{formatFileSize(file.size)} · {file.type}</span>
						</div>
						<p class="mt-1 truncate font-mono text-muted-foreground" title={file.sha256}>
							SHA-256: {file.sha256}
						</p>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</form>
