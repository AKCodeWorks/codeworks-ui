<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { FileDropzone, formatFileSize } from '$lib/components/ui/file-dropzone';

	const maxSize = 5 * 1024 * 1024;
	let files = $state<File[]>([]);
	let rejection = $state('');
	let result = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		result = files.length
			? `${files.length} image${files.length === 1 ? '' : 's'} accepted.`
			: 'Add an image.';
		if (!files.length) (event.currentTarget as HTMLFormElement).reportValidity();
	}
</script>

<form class="w-full max-w-xl space-y-3" onsubmit={submit}>
	<FileDropzone
		bind:files
		name="images"
		accept="image/png,image/jpeg,.webp"
		maxFiles={3}
		maxFileSize={maxSize}
		dropLabel="Drop up to 3 images"
		browseLabel={`PNG, JPG, or WebP · ${formatFileSize(maxSize)} each`}
		onReject={(rejections) => (rejection = rejections[0]?.message ?? '')}
		inputProps={{ required: true }}
	/>
	{#if rejection}
		<p class="text-xs text-muted-foreground">The rejection callback received: {rejection}</p>
	{/if}
	<div class="flex items-center gap-3">
		<Button type="submit">Validate images</Button>
		{#if result}<p class="text-xs text-muted-foreground" aria-live="polite">{result}</p>{/if}
	</div>
</form>
