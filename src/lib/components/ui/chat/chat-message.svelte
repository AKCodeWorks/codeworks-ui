<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cw } from '$lib/utils';

	export type ChatSide = 'left' | 'right';

	let {
		children,
		side = 'right',
		class: className,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & { children: Snippet; side?: ChatSide } = $props();
</script>

<div
	data-slot="chat-message"
	data-side={side}
	class={cw(
		'group/message flex w-full items-end gap-2',
		side === 'left' ? 'justify-start' : 'justify-end',
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
