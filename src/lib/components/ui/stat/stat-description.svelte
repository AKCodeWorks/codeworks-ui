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
	data-slot="stat-description"
	class={cn('col-start-1 row-start-3 text-xs text-muted-foreground', className)}
>
	{@render children()}
</div>
