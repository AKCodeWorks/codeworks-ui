<script lang="ts" module>
	export type StatDirection = 'horizontal' | 'vertical' | 'responsive';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cw } from '$lib/utils';

	let {
		children,
		direction = 'horizontal',
		class: className,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		direction?: StatDirection;
	} = $props();
</script>

<div
	{...restProps}
	data-slot="stats"
	data-direction={direction}
	class={cw(
		'grid overflow-x-auto rounded-xl bg-card text-card-foreground',
		{
			'auto-cols-fr grid-flow-col divide-x divide-border': direction === 'horizontal',
			'grid-flow-row divide-y divide-border': direction === 'vertical',
			'grid-flow-row divide-y divide-border sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0':
				direction === 'responsive'
		},
		className
	)}
>
	{@render children()}
</div>
