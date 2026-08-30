<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		children,
		class: className,
		role = 'log',
		'aria-live': ariaLive = 'polite',
		'aria-relevant': ariaRelevant = 'additions text',
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { children: Snippet } = $props();
</script>

<div
	data-slot="chat-messages"
	{role}
	aria-live={ariaLive}
	aria-relevant={ariaRelevant}
	class={cn('flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4', className)}
	{...restProps}
>
	{@render children()}
</div>
