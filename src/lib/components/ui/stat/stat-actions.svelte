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
	data-slot="stat-actions"
	class={cn('col-start-2 row-start-3 flex items-end justify-end gap-2 self-end', className)}
>
	{@render children()}
</div>
