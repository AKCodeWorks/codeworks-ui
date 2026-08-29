<script lang="ts">
	import { Aura, type AuraVariant } from '$lib/components/ui/aura';

	const variants: AuraVariant[] = ['default', 'dual', 'rainbow', 'holo', 'glow', 'gold', 'silver'];
</script>

<div class="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
	{#each variants as variant (variant)}
		<Aura {variant} class="w-full rounded-xl">
			<div class="rounded-[inherit] bg-card p-6 text-card-foreground shadow-sm">
				<p class="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
					{variant}
				</p>
				<p class="mt-6 text-lg font-semibold">
					{variant === 'default' ? 'Aura' : `${variant} aura`}
				</p>
			</div>
		</Aura>
	{/each}
</div>
