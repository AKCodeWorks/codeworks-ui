<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { FileDropzone, type FileUploadContext } from '$lib/components/ui/file-dropzone';
	let files = $state<File[]>([]);
	let result = $state('');

	async function uploadFile(_file: File, { onProgress, signal }: FileUploadContext) {
		for (let progress = 10; progress <= 100; progress += 10) {
			await new Promise((resolve) => setTimeout(resolve, 120));
			if (signal.aborted) throw new DOMException('Upload cancelled', 'AbortError');
			onProgress(progress);
		}
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		result = files.length
			? 'Selection is valid. Use Upload all or a row action.'
			: 'Select a file first.';
		if (!files.length) (event.currentTarget as HTMLFormElement).reportValidity();
	}
</script>

<form class="w-full max-w-xl space-y-3" onsubmit={submit}>
	<FileDropzone
		bind:files
		name="uploads"
		inputProps={{ required: true }}
		onUpload={uploadFile}
		dropLabel="Drop files to upload"
	/>
	<div class="flex items-center gap-3">
		<Button type="submit">Validate selection</Button>
		{#if result}<p class="text-xs text-muted-foreground" aria-live="polite">{result}</p>{/if}
	</div>
</form>
