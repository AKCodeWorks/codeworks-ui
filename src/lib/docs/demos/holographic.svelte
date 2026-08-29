<script lang="ts">
	import { Holographic } from '$lib/components/ui/holographic';

	const customColors = ['#00f5ff', 'hsl(280 100% 70%)', 'rgb(255 70 120)', 'gold'];
</script>

<div class="grid w-full max-w-2xl gap-5 sm:grid-cols-2">
	<Holographic class="rounded-xl shadow-xl">
		<div class="min-h-48 bg-zinc-950 p-6 text-white">
			<p class="text-xs font-medium tracking-[0.2em] text-white/60 uppercase">Default palette</p>
			<h3 class="mt-10 text-2xl font-semibold">Holographic</h3>
			<p class="mt-2 text-sm text-white/70">A spectrum shimmer over any content.</p>
		</div>
	</Holographic>

	<Holographic colors={customColors} intensity={0.22} class="rounded-xl shadow-xl">
		<div class="min-h-48 bg-slate-950 p-6 text-white">
			<p class="text-xs font-medium tracking-[0.2em] text-white/60 uppercase">Custom colors</p>
			<h3 class="mt-10 text-2xl font-semibold">Make it yours</h3>
			<p class="mt-2 text-sm text-white/70">Hex, HSL, RGB, named colors, or CSS variables.</p>
		</div>
	</Holographic>
</div>
