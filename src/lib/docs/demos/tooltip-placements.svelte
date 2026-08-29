<script lang="ts">
	import { Tooltip, type TooltipSide } from '$lib/components/ui/tooltip';

	const sides: TooltipSide[] = ['top', 'right', 'bottom', 'left'];
</script>

<div class="flex w-full flex-wrap items-center justify-center gap-8 py-8">
	{#each sides as side (side)}
		<Tooltip content={`${side} tooltip`} {side}>
			<button
				class="min-h-11 min-w-24 rounded-md border border-border bg-background px-4 shadow-sm"
			>
				{side}
			</button>
		</Tooltip>
	{/each}
</div>
