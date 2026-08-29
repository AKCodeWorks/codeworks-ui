<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cw } from '$lib/utils';

	let {
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { children: Snippet } = $props();
</script>

<div
	{...restProps}
	data-slot="stat-figure"
	class={cw('col-start-2 row-start-1 row-end-4 place-self-start', className)}
>
	{@render children()}
</div>
