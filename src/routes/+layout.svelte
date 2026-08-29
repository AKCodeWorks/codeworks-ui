<script lang="ts">
	import type { Snippet } from 'svelte';
	import { asset, resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Codeworks UI — an open Svelte component registry built on Bits UI."
	/>
</svelte:head>

<div class="min-h-screen bg-background font-sans text-foreground antialiased">
	<header class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur">
		<div class="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
			<a href={resolve('/')} class="mr-6 flex items-center gap-2 font-semibold tracking-tight">
				<span
					class="grid size-7 place-items-center rounded-md bg-foreground text-xs font-bold text-background"
					>CW</span
				>
				<span>Codeworks UI</span>
			</a>
			<nav
				class="flex items-center gap-5 text-sm text-muted-foreground"
				aria-label="Main navigation"
			>
				<a
					href={resolve('/docs/components/[component]', { component: 'button' })}
					class="transition-colors hover:text-foreground">Components</a
				>
				<a href={asset('/r/button.json')} class="transition-colors hover:text-foreground"
					>Registry</a
				>
			</nav>
			<a
				href="https://github.com"
				class="ml-auto text-sm text-muted-foreground transition-colors hover:text-foreground"
				>GitHub</a
			>
		</div>
	</header>
	{@render children()}
</div>
