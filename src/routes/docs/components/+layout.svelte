<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { components } from '$lib/docs/catalog';

	let { children }: { children: Snippet } = $props();
</script>

<div class="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
	<aside class="hidden min-h-[calc(100vh-3.5rem)] border-r border-border px-6 py-10 md:block">
		<p class="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
			Components
		</p>
		<nav class="flex flex-col gap-1" aria-label="Components">
			{#each components as component (component.name)}
				<a
					href={resolve('/docs/components/[component]', { component: component.name })}
					aria-current={page.url.pathname.endsWith(`/${component.name}`) ? 'page' : undefined}
					class={`rounded-md px-3 py-2 text-sm transition-colors ${page.url.pathname.endsWith(`/${component.name}`) ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}
				>
					{component.title}
				</a>
			{/each}
		</nav>
	</aside>
	{@render children()}
</div>
