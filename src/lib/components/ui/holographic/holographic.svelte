<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { cw } from '$lib/utils/cw';

	const defaultColors = ['#22d3ee', '#818cf8', '#e879f9', '#facc15', '#34d399'];

	let {
		children,
		colors = defaultColors,
		intensity = 0.16,
		duration = 5000,
		class: className
	}: {
		children: Snippet;
		colors?: string[];
		intensity?: number;
		duration?: number;
		class?: string;
	} = $props();

	const palette = $derived(colors.length ? colors : defaultColors);
	const gradient = $derived(
		`linear-gradient(115deg, transparent 0%, ${palette
			.map((color, index) => `${color} ${((index + 1) / (palette.length + 1)) * 100}%`)
			.join(', ')}, transparent 100%)`
	);
	const opacity = $derived(String(Math.min(1, Math.max(0, intensity))));

	const animateColors: Attachment<HTMLDivElement> = (element) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const animationDuration = Math.max(1000, duration);
		const animation = element.animate(
			[
				{ backgroundPosition: '0% 50%', transform: 'rotate(-4deg) scale(1.15)' },
				{ backgroundPosition: '100% 50%', transform: 'rotate(4deg) scale(1.25)' },
				{ backgroundPosition: '0% 50%', transform: 'rotate(-4deg) scale(1.15)' }
			],
			{ duration: animationDuration, iterations: Infinity, easing: 'ease-in-out' }
		);

		return () => animation.cancel();
	};

	const animateShimmer: Attachment<HTMLDivElement> = (element) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const animation = element.animate(
			[
				{ transform: 'translateX(-180%) skewX(-18deg)' },
				{ transform: 'translateX(380%) skewX(-18deg)' }
			],
			{ duration: Math.max(1000, duration) * 0.8, iterations: Infinity, easing: 'ease-in-out' }
		);

		return () => animation.cancel();
	};
</script>

<div
	data-slot="holographic"
	class={cw('relative isolate overflow-hidden', className)}
	style:--holographic-gradient={gradient}
	style:--holographic-opacity={opacity}
>
	<div class="relative z-10">{@render children()}</div>
	<div
		{@attach animateColors}
		aria-hidden="true"
		class="pointer-events-none absolute -inset-1/2 z-20 bg-[image:var(--holographic-gradient)] bg-[length:200%_200%] opacity-[var(--holographic-opacity)] mix-blend-screen motion-reduce:transform-none"
	></div>
	<div
		{@attach animateShimmer}
		aria-hidden="true"
		class="pointer-events-none absolute inset-y-0 -left-1/2 z-30 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-25 mix-blend-soft-light blur-2xl motion-reduce:hidden"
	></div>
</div>
