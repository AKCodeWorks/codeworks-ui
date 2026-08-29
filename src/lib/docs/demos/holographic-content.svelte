<script lang="ts">
	import { Holographic } from '$lib/components/ui/holographic';

	const colors = ['oklch(0.78 0.18 190)', 'var(--color-violet-400)', '#fb7185'];
</script>

<div class="flex w-full max-w-2xl flex-col items-start gap-6 sm:flex-row sm:items-center">
	<Holographic {colors} intensity={0.14} class="rounded-full shadow-lg">
		<button
			type="button"
			class="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			Generate preview
		</button>
	</Holographic>

	<Holographic {colors} intensity={0.1} duration={7000} class="rounded-2xl shadow-xl">
		<article class="max-w-xs rounded-2xl bg-zinc-950 p-5 text-white">
			<p class="text-xs font-medium tracking-widest text-white/50 uppercase">Pro plan</p>
			<p class="mt-3 text-3xl font-semibold">$24</p>
			<p class="mt-1 text-sm text-white/60">Unlimited projects and previews.</p>
		</article>
	</Holographic>
</div>
