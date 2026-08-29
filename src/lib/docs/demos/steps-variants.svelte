<script lang="ts">
	import * as Steps from '$lib/components/ui/steps';
</script>

{#snippet checkIcon()}
	<svg viewBox="0 0 20 20" fill="none" class="size-4" aria-hidden="true">
		<path d="m5 10 3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet warningIcon()}
	<svg viewBox="0 0 20 20" fill="none" class="size-4" aria-hidden="true">
		<path d="M10 6v5m0 3h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
	</svg>
{/snippet}

<Steps.Root direction="responsive" class="max-w-3xl">
	<Steps.Item state="complete" variant="success" indicator={checkIcon}>Uploaded</Steps.Item>
	<Steps.Item state="complete" variant="info" indicator={checkIcon}>Processed</Steps.Item>
	<Steps.Item state="current" variant="warning" indicator={warningIcon}>Needs review</Steps.Item>
	<Steps.Item variant="destructive" indicator="!">Resolve issues</Steps.Item>
</Steps.Root>
