<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<div class="flex items-center gap-4">
	<Avatar.Root class="size-12"
		><Avatar.Image src="https://github.com/shadcn.png" alt="shadcn's avatar" /><Avatar.Fallback
			>CN</Avatar.Fallback
		></Avatar.Root
	>
	<Avatar.Root class="size-12"
		><Avatar.Image
			src="data:image/png;base64,invalid"
			alt="Missing example avatar"
		/><Avatar.Fallback>AK</Avatar.Fallback></Avatar.Root
	>
	<Avatar.Root class="size-12 rounded-lg"
		><Avatar.Fallback class="rounded-lg bg-primary text-primary-foreground">UI</Avatar.Fallback
		></Avatar.Root
	>
</div>
