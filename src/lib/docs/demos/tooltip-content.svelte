<script lang="ts">
	import { Tooltip } from '$lib/components/ui/tooltip';
</script>

<Tooltip side="bottom">
	{#snippet content()}
		<div class="space-y-1 py-0.5">
			<p class="font-semibold">Keyboard shortcut</p>
			<p class="text-background/75">Press ⌘ K to open search.</p>
		</div>
	{/snippet}

	<button
		aria-label="Search help"
		class="grid size-11 place-items-center rounded-full border border-border bg-background text-lg shadow-sm"
	>
		?
	</button>
</Tooltip>
