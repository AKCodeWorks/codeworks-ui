<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import type { HTMLOlAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';
	import { STEPS_CONTEXT, type StepsDirection } from './steps-context';

	let {
		children,
		direction = 'horizontal',
		class: className,
		...restProps
	}: HTMLOlAttributes & {
		children: Snippet;
		direction?: StepsDirection;
	} = $props();

	setContext<() => StepsDirection>(STEPS_CONTEXT, () => direction);
</script>

<ol
	{...restProps}
	data-slot="steps"
	data-direction={direction}
	class={cn(
		'w-full',
		{
			'flex items-start overflow-x-auto': direction === 'horizontal',
			'flex flex-col': direction === 'vertical',
			'flex flex-col sm:flex-row sm:items-start sm:overflow-x-auto': direction === 'responsive'
		},
		className
	)}
>
	{@render children()}
</ol>
