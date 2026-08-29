<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
</script>

<Accordion.Root type="single" value="item-1" class="w-full max-w-lg">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
		<Accordion.Content
			>Yes. It follows the WAI-ARIA accordion pattern through Bits UI.</Accordion.Content
		>
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<Accordion.Trigger>Can I style it?</Accordion.Trigger>
		<Accordion.Content
			>Yes. Every part accepts Tailwind classes and native element props.</Accordion.Content
		>
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<Accordion.Trigger>Can multiple items open?</Accordion.Trigger>
		<Accordion.Content
			>Yes. Set the root type to multiple and bind to a string array.</Accordion.Content
		>
	</Accordion.Item>
</Accordion.Root>
