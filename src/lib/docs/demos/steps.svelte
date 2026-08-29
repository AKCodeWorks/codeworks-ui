<script lang="ts">
	import * as Steps from '$lib/components/ui/steps';
</script>

<Steps.Root class="max-w-3xl">
	<Steps.Item state="complete" indicator={1}>Register</Steps.Item>
	<Steps.Item state="complete" indicator={2}>Choose plan</Steps.Item>
	<Steps.Item state="current" indicator={3}>Purchase</Steps.Item>
	<Steps.Item indicator={4}>Receive product</Steps.Item>
</Steps.Root>
