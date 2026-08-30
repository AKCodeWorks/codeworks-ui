<script lang="ts">
	import { components } from '$lib/docs/catalog';
	import { resolve } from '$app/paths';
</script>

<svelte:head><title>Codeworks UI — Svelte components built on Bits UI</title></svelte:head>

<main>
	<section class="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-32">
		<div
			class="mb-5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
		>
			Svelte 5 · Bits UI · Tailwind CSS
		</div>
		<h1 class="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">CodeWorks UI</h1>
		<p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
			A Shadcn registry of Svelte components.
		</p>
		<div class="mt-8">
			<a
				href={resolve('/docs/components/[component]', { component: 'aura' })}
				data-sveltekit-reload
				class="inline-flex h-11 touch-manipulation items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
				>Browse components</a
			>
		</div>
	</section>
	<section class="mx-auto max-w-5xl px-6 pb-24">
		<div class="mb-8 flex items-end justify-between border-b border-border pb-4">
			<div>
				<p class="text-sm font-medium text-muted-foreground">Registry</p>
				<h2 class="mt-1 text-2xl font-semibold tracking-tight">Components</h2>
			</div>
			<span class="text-sm text-muted-foreground">{components.length} available</span>
		</div>
		<div class="grid gap-4 sm:grid-cols-3">
			{#each components as component (component.name)}
				<a
					href={resolve('/docs/components/[component]', { component: component.name })}
					class="group rounded-xl border border-border p-5 transition-colors hover:border-foreground/20 hover:bg-muted/50"
				>
					<div
						class="mb-8 grid size-9 place-items-center rounded-md border border-border bg-background font-mono text-xs"
					>
						{component.title.slice(0, 2)}
					</div>
					<h3 class="font-semibold group-hover:underline">{component.title}</h3>
					<p class="mt-2 text-sm leading-6 text-muted-foreground">{component.description}</p>
				</a>
			{/each}
		</div>
	</section>
</main>
