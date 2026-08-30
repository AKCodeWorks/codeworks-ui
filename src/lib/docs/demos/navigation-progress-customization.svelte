<script lang="ts">
	import { NavigationProgress } from '$lib/components/ui/navigation-progress';

	let value = $state(64);
</script>

<div class="grid w-full max-w-xl gap-5">
	<div
		class="relative grid min-h-48 place-items-center overflow-hidden rounded-xl border border-border bg-background p-6"
	>
		<NavigationProgress
			contained
			trackNavigation={false}
			{value}
			height={6}
			color="oklch(0.7 0.18 250)"
		/>
		<p class="font-mono text-sm text-muted-foreground">{value}%</p>
	</div>
	<label class="grid gap-2 text-sm font-medium">
		Controlled progress
		<input class="accent-primary" type="range" min="1" max="100" bind:value />
	</label>
</div>
