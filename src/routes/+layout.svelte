<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { LayoutData } from './$types';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import { Navbar, type NavbarItem } from '$lib/components/ui/navbar';
	import { components } from '$lib/docs/catalog';
	import ComponentSearch from '$lib/docs/component-search.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const navigationItems = $derived.by(
		() =>
			[
				{
					label: 'Components',
					href: resolve('/docs/components/[component]', { component: components[0].name }),
					description: 'Browse the complete Codeworks UI component collection.',
					active: page.url.pathname.startsWith('/docs/components'),
					showParentLink: false,
					mobileShowDescriptions: false,
					popoverClass: 'w-[min(44rem,calc(100vw-2rem))]',
					subroutesClass: 'max-h-[min(34rem,calc(100vh-11rem))] grid-cols-2 gap-1 overflow-y-auto',
					subroutes: components.map((component) => ({
						label: component.title,
						href: resolve('/docs/components/[component]', { component: component.name }),
						description: component.description,
						active: page.url.pathname.endsWith(`/${component.name}`)
					}))
				},
				...(data.showPlayground
					? [
							{
								label: 'Playground',
								href: resolve('/playground'),
								description: 'Test component demos and remote functions.',
								badge: 'Dev',
								active: page.url.pathname.startsWith('/playground')
							}
						]
					: [])
			] satisfies NavbarItem[]
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Codeworks UI — an open Svelte component registry built on Bits UI."
	/>
</svelte:head>

<ModeWatcher lightClassNames={['light']} themeColors={{ light: '#ffffff', dark: '#09090b' }} />

{#snippet brand()}
	<img src={favicon} alt="" class="size-7 rounded-md" />
	<span class="ml-2 hidden sm:inline">Codeworks UI</span>
{/snippet}

{#snippet themeToggle()}
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
{/snippet}

{#snippet actions()}
	<div class="w-64 lg:w-80">
		<ComponentSearch />
	</div>
	{@render themeToggle()}
	<a
		href="https://github.com/AKCodeWorks/codeworks-ui"
		class="text-sm text-muted-foreground transition-colors hover:text-foreground">GitHub</a
	>
{/snippet}

{#snippet mobileActions()}
	<div class="grid gap-3">
		<ComponentSearch class="sm:mx-0 sm:max-w-none" />
		<div class="flex items-center gap-2">
			<a
				href="https://github.com/AKCodeWorks/codeworks-ui"
				class="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
				>View on GitHub</a
			>
			{@render themeToggle()}
		</div>
	</div>
{/snippet}

<div class="min-h-screen bg-background font-sans text-foreground antialiased">
	<Navbar
		items={navigationItems}
		{brand}
		brandHref={resolve('/')}
		{actions}
		{mobileActions}
		mobileTitle="Codeworks UI"
		mobileDescription="Browse components and site resources."
		class="sticky top-0 z-50 border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
		containerClass="h-14 max-w-7xl gap-2 sm:gap-4"
	/>
	{@render children()}
</div>
