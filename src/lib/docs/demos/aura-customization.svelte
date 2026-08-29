<script lang="ts">
	import { Aura, type AuraSize } from '$lib/components/ui/aura';

	const sizes: AuraSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
</script>

<div class="w-full space-y-12">
	<div class="flex flex-wrap items-center justify-center gap-6">
		{#each sizes as size (size)}
			<Aura {size} variant="rainbow" class="rounded-lg">
				<button class="rounded-[inherit] bg-card px-4 py-2 text-sm font-medium uppercase shadow-sm">
					{size}
				</button>
			</Aura>
		{/each}
	</div>

	<div class="grid gap-8 sm:grid-cols-2">
		<Aura color="orangered" class="w-full rounded-xl">
			<div class="rounded-[inherit] bg-card p-6 shadow-sm">
				<p class="font-semibold">Custom color</p>
				<p class="mt-1 text-sm text-muted-foreground">Any valid CSS color value works.</p>
			</div>
		</Aura>

		<Aura
			colors={['#22d3ee', 'hsl(280 100% 65%)', 'rgb(244 63 94)', 'gold']}
			backgroundColor="rgb(20 184 166 / 0.2)"
			duration={2000}
			class="w-full rounded-xl"
		>
			<div class="rounded-[inherit] bg-card p-6 shadow-sm">
				<p class="font-semibold">Custom palette, backdrop, and speed</p>
				<p class="mt-1 text-sm text-muted-foreground">Mix any valid CSS color formats.</p>
			</div>
		</Aura>
	</div>
</div>
