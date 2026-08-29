<script lang="ts" module>
	import { cw } from '$lib/utils';

	export type AuraVariant = 'default' | 'dual' | 'rainbow' | 'holo' | 'glow' | 'gold' | 'silver';
	export type AuraSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export const auraVariants = ({
		size = 'md',
		class: className
	}: {
		size?: AuraSize;
		class?: import('clsx').ClassValue;
	} = {}) =>
		cw(
			"relative isolate inline-block bg-[image:var(--aura-gradient)] text-violet-500 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-[image:var(--aura-gradient)] before:opacity-60 before:blur-sm before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-[image:var(--aura-gradient)] after:opacity-35 after:blur-xl after:content-[''] [&>*]:relative [&>*]:z-10",
			{
				'p-0': size === 'xs',
				'p-px': size === 'sm',
				'p-0.5': size === 'md',
				'p-[0.1875rem]': size === 'lg',
				'p-1': size === 'xl'
			},
			className
		);
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';

	type AuraProps = Omit<HTMLAttributes<HTMLDivElement>, 'color'> & {
		children: Snippet;
		variant?: AuraVariant;
		size?: AuraSize;
		color?: string;
		colors?: string[];
		backgroundColor?: string;
		duration?: number;
		class?: string;
	};

	let {
		children,
		variant = 'default',
		size = 'md',
		color,
		colors = [],
		backgroundColor,
		duration = 6000,
		class: className,
		...restProps
	}: AuraProps = $props();

	const gradients: Record<AuraVariant, string> = {
		default:
			'conic-gradient(from var(--aura-angle), transparent 0deg, transparent 225deg, var(--aura-color) 360deg)',
		dual: 'repeating-conic-gradient(from var(--aura-angle), transparent 0%, transparent 40%, var(--aura-color) 50%)',
		rainbow:
			'conic-gradient(from var(--aura-angle) in oklch longer hue, transparent 10%, oklch(80% 0.15 0deg), oklch(80% 0.15 360deg), transparent 90%)',
		holo: 'repeating-conic-gradient(from var(--aura-angle), oklch(0.82 0.17 327), oklch(0.75 0.12 274), oklch(0.82 0.11 191), oklch(0.91 0.11 105), oklch(0.88 0.08 68), oklch(0.82 0.17 327) 10%)',
		glow: 'radial-gradient(closest-corner at center, var(--aura-color) 0%, transparent var(--aura-spread))',
		gold: 'repeating-conic-gradient(from var(--aura-angle), oklch(0.66 0.19 72), oklch(0.96 0.08 103), oklch(0.72 0.17 82), oklch(0.96 0.08 103), oklch(0.61 0.12 76), oklch(0.66 0.19 72) 50%)',
		silver:
			'repeating-conic-gradient(from var(--aura-angle), oklch(0.3 0 0), oklch(0.9 0 0), oklch(0.6 0 0), oklch(0.9 0 0), oklch(0.5 0 0), oklch(0.3 0 0) 50%)'
	};

	const customGradient = $derived(
		colors.length
			? `repeating-conic-gradient(from var(--aura-angle), ${colors
					.map((entry, index) => `${entry} ${(index / colors.length) * 100}%`)
					.join(', ')}, ${colors[0]} 100%)`
			: undefined
	);
	const gradient = $derived(customGradient ?? gradients[variant]);
	const animationDuration = $derived(Math.max(1000, duration));

	const animateAura: Attachment<HTMLDivElement> = (element) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		try {
			CSS.registerProperty({
				name: '--aura-angle',
				syntax: '<angle>',
				inherits: true,
				initialValue: '0deg'
			});
		} catch {
			// The property is shared by every Aura instance and may already be registered.
		}

		if (variant === 'glow') {
			try {
				CSS.registerProperty({
					name: '--aura-spread',
					syntax: '<percentage>',
					inherits: true,
					initialValue: '90%'
				});
			} catch {
				// The property is shared by every Aura instance and may already be registered.
			}

			const animation = element.animate(
				[
					{ '--aura-spread': '90%' },
					{ '--aura-spread': '55%' },
					{ '--aura-spread': '90%' }
				] as Keyframe[],
				{ duration: animationDuration, iterations: Infinity, easing: 'ease-in-out' }
			);

			return () => animation.cancel();
		}

		const animation = element.animate(
			[{ '--aura-angle': '0deg' }, { '--aura-angle': '360deg' }] as Keyframe[],
			{
				duration: variant === 'holo' ? animationDuration * 3 : animationDuration,
				iterations: Infinity
			}
		);

		return () => animation.cancel();
	};
</script>

<div
	{@attach animateAura}
	{...restProps}
	data-slot="aura"
	data-variant={variant}
	data-size={size}
	class={auraVariants({ size, class: className })}
	style:--aura-angle="0deg"
	style:--aura-spread="90%"
	style:--aura-color={color ?? 'currentColor'}
	style:--aura-gradient={gradient}
	style:background-color={backgroundColor}
>
	{@render children()}
</div>
