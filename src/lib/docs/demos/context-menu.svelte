<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex h-40 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground select-none"
	>
		Right-click on desktop or long-press on mobile
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-52">
		<ContextMenu.Item>Open</ContextMenu.Item>
		<ContextMenu.Item>Rename</ContextMenu.Item>
		<ContextMenu.Item>
			Duplicate
			<ContextMenu.Shortcut>⌘D</ContextMenu.Shortcut>
		</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
