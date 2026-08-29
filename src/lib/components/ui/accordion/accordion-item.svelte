<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cw } from '$lib/utils/cw';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AccordionPrimitive.ItemProps = $props();
</script>

<AccordionPrimitive.Item
	bind:ref
	data-slot="accordion-item"
	class={cw('border-b border-border last:border-b-0', className)}
	{...restProps}
/>
