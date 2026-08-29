<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cw } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Omit<AccordionPrimitive.TriggerProps, 'child'> & { children?: Snippet } = $props();
</script>

<AccordionPrimitive.Header class="flex">
	<AccordionPrimitive.Trigger
		bind:ref
		data-slot="accordion-trigger"
		class={cw(
			'group flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
			aria-hidden="true"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
