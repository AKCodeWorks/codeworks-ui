<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Error as ErrorPage } from '$lib/components/ui/error';
</script>

<svelte:head>
	<title>{page.status} — Codeworks UI</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="px-5 py-6 sm:px-8 lg:px-12">
	<ErrorPage
		status={page.status}
		error={page.error}
		homeHref={resolve('/')}
		showRetry={page.status !== 404}
		class="min-h-[calc(100svh-6.5rem)] rounded-xl"
	/>
</main>
