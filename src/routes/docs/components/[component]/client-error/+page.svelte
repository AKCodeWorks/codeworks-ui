<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Client error test — Codeworks UI</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="grid min-h-[60vh] place-items-center px-5 py-16">
	<div class="max-w-md space-y-4 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Client error test</h1>
		<p class="text-muted-foreground">
			This route throws only during client-side navigation. Return to the Error docs and use the
			demo button to trigger it.
		</p>
		<Button href={resolve('/docs/components/[component]', { component: 'error' })}>
			Back to Error docs
		</Button>
	</div>
</main>
