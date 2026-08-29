<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import ComponentSearch from '$lib/docs/component-search.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Codeworks UI — an open Svelte component registry built on Bits UI."
	/>
</svelte:head>

<ModeWatcher themeColors={{ light: '#ffffff', dark: '#09090b' }} />

<div class="min-h-screen bg-background font-sans text-foreground antialiased">
	<header class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur">
		<div class="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
			<a href={resolve('/')} class="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
				<img
					src={favicon}
					alt="codeworks ui"
					class="grid size-7 place-items-center rounded-md bg-foreground text-xs font-bold text-background"
				/>

				<span class="hidden sm:inline">Codeworks UI</span>
			</a>
			<nav
				class="hidden items-center text-sm text-muted-foreground sm:flex"
				aria-label="Main navigation"
			>
				<a
					href={resolve('/docs/components/[component]', { component: 'aura' })}
					class="transition-colors hover:text-foreground">Components</a
				>
			</nav>
			<ComponentSearch />
			<button
				type="button"
				onclick={toggleMode}
				class="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
				aria-label="Toggle color theme"
				title="Toggle color theme"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="size-4 dark:hidden"
				>
					<circle cx="12" cy="12" r="4"></circle>
					<path
						d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"
					></path>
				</svg>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class="hidden size-4 dark:block"
				>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
				</svg>
			</button>
			<a
				href="https://github.com/AKCodeWorks/codeworks-ui"
				class="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline"
				>GitHub</a
			>
		</div>
	</header>
	{@render children()}
</div>
