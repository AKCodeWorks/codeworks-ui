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
	data-slot="chat-content"
	class={cw(
		'max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm leading-relaxed wrap-break-word text-foreground shadow-xs',
		'group-data-[side=left]/message:rounded-bl-sm',
		'group-data-[side=right]/message:rounded-br-sm group-data-[side=right]/message:bg-primary group-data-[side=right]/message:text-primary-foreground',
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
