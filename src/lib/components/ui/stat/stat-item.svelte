<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { children: Snippet } = $props();
</script>

<div
	{...restProps}
	data-slot="stat"
	class={cn(
		'grid min-w-56 grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto_auto] gap-x-4 px-6 py-5',
		className
	)}
>
	{@render children()}
</div>
