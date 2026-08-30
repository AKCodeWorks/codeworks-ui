<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { FileDropzone } from '$lib/components/ui/file-dropzone';

	let files = $state<File[]>([]);
	let result = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		result = files.length
			? `${files.length} file${files.length === 1 ? '' : 's'} ready to submit.`
			: 'Add at least one file.';
		if (!files.length) (event.currentTarget as HTMLFormElement).reportValidity();
	}
</script>

<form class="w-full max-w-xl space-y-3" onsubmit={submit}>
	<FileDropzone
		bind:files
		name="attachments"
		inputProps={{ required: true }}
		onFilesChange={() => (result = '')}
	/>
	<div class="flex items-center gap-3">
		<Button type="submit">Submit files</Button>
		{#if result}<p class="text-xs text-muted-foreground" aria-live="polite">{result}</p>{/if}
	</div>
</form>
