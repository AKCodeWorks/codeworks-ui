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
	data-slot="chat"
	class={cn(
		'flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background',
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
