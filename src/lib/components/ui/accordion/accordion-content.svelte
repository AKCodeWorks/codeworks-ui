<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cw } from '$lib/utils/cw';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Omit<AccordionPrimitive.ContentProps, 'child'> & { children?: Snippet } = $props();
</script>

<AccordionPrimitive.Content
	bind:ref
	data-slot="accordion-content"
	class="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
	{...restProps}
>
	<div class={cw('pt-0 pb-4 text-muted-foreground', className)}>{@render children?.()}</div>
</AccordionPrimitive.Content>
