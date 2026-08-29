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
	data-slot="chat"
	class={cw(
		'flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background',
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
