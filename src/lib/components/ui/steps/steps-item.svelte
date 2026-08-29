<script lang="ts" module>
	export type StepState = 'pending' | 'current' | 'complete';
	export type StepVariant =
		'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'destructive';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { cw } from '$lib/utils';
	import { STEPS_CONTEXT, type StepsDirection } from './steps-context';

	type Props = HTMLLiAttributes & {
		children: Snippet;
		state?: StepState;
		variant?: StepVariant;
		indicator?: string | number | Snippet;
		indicatorClass?: string;
		labelClass?: string;
	};

	let {
		children,
		state = 'pending',
		variant = 'primary',
		indicator,
		indicatorClass,
		labelClass,
		class: className,
		'aria-current': ariaCurrent,
		...restProps
	}: Props = $props();

	const getDirection = getContext<() => StepsDirection>(STEPS_CONTEXT);
	const direction = $derived(getDirection?.() ?? 'horizontal');

	const indicatorColors: Record<StepVariant, string> = {
		primary: 'border-primary bg-primary text-primary-foreground',
		secondary: 'border-violet-500 bg-violet-500 text-white',
		accent: 'border-cyan-400 bg-cyan-400 text-cyan-950',
		neutral: 'border-zinc-700 bg-zinc-700 text-white',
		info: 'border-sky-500 bg-sky-500 text-white',
		success: 'border-emerald-500 bg-emerald-500 text-white',
		warning: 'border-amber-400 bg-amber-400 text-amber-950',
		destructive: 'border-red-500 bg-red-500 text-white'
	};

	const beforeColors: Record<StepVariant, string> = {
		primary: 'before:bg-primary',
		secondary: 'before:bg-violet-500',
		accent: 'before:bg-cyan-400',
		neutral: 'before:bg-zinc-700',
		info: 'before:bg-sky-500',
		success: 'before:bg-emerald-500',
		warning: 'before:bg-amber-400',
		destructive: 'before:bg-red-500'
	};

	const afterColors: Record<StepVariant, string> = {
		primary: 'after:bg-primary',
		secondary: 'after:bg-violet-500',
		accent: 'after:bg-cyan-400',
		neutral: 'after:bg-zinc-700',
		info: 'after:bg-sky-500',
		success: 'after:bg-emerald-500',
		warning: 'after:bg-amber-400',
		destructive: 'after:bg-red-500'
	};
</script>

<li
	{...restProps}
	data-slot="step"
	data-state={state}
	data-variant={variant}
	aria-current={ariaCurrent ?? (state === 'current' ? 'step' : undefined)}
	class={cw(
		'relative grid list-none before:absolute before:z-0 before:bg-border after:absolute after:z-0 after:bg-border',
		{
			'min-w-28 flex-1 grid-rows-[2rem_auto] justify-items-center gap-y-2 px-2 text-center before:top-[0.9375rem] before:left-0 before:h-0.5 before:w-1/2 after:top-[0.9375rem] after:right-0 after:h-0.5 after:w-1/2 first:before:hidden last:after:hidden':
				direction === 'horizontal',
			'min-h-16 grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3 text-left before:top-0 before:left-[0.9375rem] before:h-4 before:w-0.5 after:top-4 after:bottom-0 after:left-[0.9375rem] after:w-0.5 first:before:hidden last:after:hidden':
				direction === 'vertical',
			'min-h-16 grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3 text-left before:top-0 before:left-[0.9375rem] before:h-4 before:w-0.5 after:top-4 after:bottom-0 after:left-[0.9375rem] after:w-0.5 first:before:hidden last:after:hidden sm:min-h-0 sm:min-w-28 sm:flex-1 sm:grid-cols-1 sm:grid-rows-[2rem_auto] sm:justify-items-center sm:gap-x-0 sm:gap-y-2 sm:px-2 sm:text-center sm:before:top-[0.9375rem] sm:before:left-0 sm:before:h-0.5 sm:before:w-1/2 sm:after:top-[0.9375rem] sm:after:right-0 sm:after:bottom-auto sm:after:left-auto sm:after:h-0.5 sm:after:w-1/2':
				direction === 'responsive'
		},
		state !== 'pending' && beforeColors[variant],
		state === 'complete' && afterColors[variant],
		className
	)}
>
	<span
		data-slot="step-indicator"
		class={cw(
			'relative z-10 col-start-1 row-start-1 inline-flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold',
			state === 'pending'
				? 'border-border bg-background text-muted-foreground'
				: indicatorColors[variant],
			state === 'current' && 'ring-4 ring-ring/20',
			indicatorClass
		)}
	>
		{#if typeof indicator === 'function'}
			{@render indicator()}
		{:else if indicator !== undefined}
			{indicator}
		{:else if state === 'complete'}
			<span aria-hidden="true">✓</span>
		{:else}
			<span class="size-1.5 rounded-full bg-current" aria-hidden="true"></span>
		{/if}
	</span>

	<span
		data-slot="step-label"
		class={cw(
			'col-start-2 row-start-1 pt-1.5 text-sm sm:col-start-auto',
			state === 'pending' ? 'text-muted-foreground' : 'font-medium text-foreground',
			(direction === 'horizontal' || direction === 'responsive') &&
				'row-start-2 pt-0 sm:col-start-1',
			direction === 'responsive' && 'col-start-2 row-start-1 pt-1.5 sm:row-start-2 sm:pt-0',
			labelClass
		)}
	>
		{@render children()}
	</span>
</li>
