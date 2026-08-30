<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Tabs } from 'bits-ui';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Code, languageFromFilename } from '$lib/components/ui/code';
	import { Install } from '$lib/components/ui/install';
	import { getComponent } from '$lib/docs/catalog';

	let { data }: { data: PageData } = $props();
	const component = $derived(getComponent(data.slug)!);
	const Demo = $derived(component.demo);
	const registryUrl = $derived(new URL(`/r/${component.name}.json`, page.url.origin).href);
	const installScript = $derived(`shadcn-svelte@latest add ${registryUrl}`);
	const hasApiDescriptions = $derived(component.api.some((property) => property.description));
</script>

<svelte:head>
	<title>{component.title} — Codeworks UI</title>
	<meta name="description" content={component.description} />
</svelte:head>

<main class="min-w-0 px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
	<div class="mx-auto max-w-4xl">
		<div class="border-b border-border pb-7 sm:pb-8">
			<p class="text-sm font-medium text-muted-foreground">Components</p>
			<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{component.title}</h1>
			<p
				class="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-4 sm:text-lg sm:leading-8"
			>
				{component.description}
			</p>
		</div>

		<section class="pt-8 sm:pt-10" aria-labelledby="preview-title">
			<Tabs.Root value="preview">
				<div class="mb-4 grid gap-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<h2 id="preview-title" class="text-2xl font-semibold tracking-tight">Preview</h2>
						{#if component.name === 'error'}
							<Button
								href={resolve('/docs/components/[component]/client-error', {
									component: 'error'
								})}
								variant="destructive"
								size="sm"
								data-sveltekit-preload-data="off"
							>
								Throw client error
							</Button>
						{/if}
					</div>
					<Tabs.List
						aria-label="Component example"
						class="grid w-full grid-cols-2 rounded-md border border-border p-1 text-sm text-muted-foreground sm:flex sm:w-auto"
					>
						<Tabs.Trigger
							value="preview"
							class="rounded px-3 py-1.5 whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=active]:bg-muted data-[state=active]:font-medium data-[state=active]:text-foreground"
							>Preview</Tabs.Trigger
						>
						<Tabs.Trigger
							value="code"
							class="rounded px-3 py-1.5 whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=active]:bg-muted data-[state=active]:font-medium data-[state=active]:text-foreground"
							>View Code</Tabs.Trigger
						>
					</Tabs.List>
				</div>
				<Tabs.Content value="preview">
					<div
						class="grid min-h-72 place-items-center rounded-xl border border-border bg-card p-3 sm:min-h-80 sm:p-8"
					>
						<Demo />
					</div>
				</Tabs.Content>
				<Tabs.Content value="code">
					<Code
						code={component.demoSource}
						language="svelte"
						label={`${component.name}.demo.svelte`}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		{#if component.moreExamples.length}
			<section class="pt-12" aria-labelledby="more-examples-title">
				<h2 id="more-examples-title" class="text-2xl font-semibold tracking-tight">
					More examples
				</h2>
				<div class="mt-6 space-y-10">
					{#each component.moreExamples as example (example.name)}
						{@const Example = example.demo}
						<article aria-labelledby={`example-${example.name}`}>
							<Tabs.Root value="preview">
								<div
									class="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4"
								>
									<div>
										<h3 id={`example-${example.name}`} class="text-lg font-semibold">
											{example.title}
										</h3>
										{#if example.description}
											<p class="mt-1 text-sm text-muted-foreground">{example.description}</p>
										{/if}
									</div>
									<Tabs.List
										aria-label={`${example.title} example`}
										class="grid w-full grid-cols-2 rounded-md border border-border p-1 text-sm text-muted-foreground sm:flex sm:w-auto sm:shrink-0"
									>
										<Tabs.Trigger
											value="preview"
											class="rounded px-3 py-1.5 whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=active]:bg-muted data-[state=active]:font-medium data-[state=active]:text-foreground"
											>Preview</Tabs.Trigger
										>
										<Tabs.Trigger
											value="code"
											class="rounded px-3 py-1.5 whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=active]:bg-muted data-[state=active]:font-medium data-[state=active]:text-foreground"
											>View Code</Tabs.Trigger
										>
									</Tabs.List>
								</div>
								<Tabs.Content value="preview">
									<div
										class="grid min-h-72 place-items-center rounded-xl border border-border bg-card p-3 sm:min-h-80 sm:p-8"
									>
										<Example />
									</div>
								</Tabs.Content>
								<Tabs.Content value="code">
									<Code
										code={example.demoSource}
										language="svelte"
										label={`${component.name}-${example.name}.demo.svelte`}
									/>
								</Tabs.Content>
							</Tabs.Root>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<section class="pt-12" aria-labelledby="installation-title">
			<h2 id="installation-title" class="text-2xl font-semibold tracking-tight">Installation</h2>
			<p class="mt-3 text-muted-foreground">
				Install directly from the hosted registry with the shadcn-svelte CLI.
			</p>
			<div class="mt-5">
				<Install values={component.installValues} script={installScript} />
			</div>
		</section>

		<section class="pt-12" aria-labelledby="usage-title">
			<h2 id="usage-title" class="text-2xl font-semibold tracking-tight">Usage</h2>
			<p class="mt-3 text-muted-foreground">{component.usage}</p>
		</section>

		{#if component.api.length}
			<section class="pt-12" aria-labelledby="api-title">
				<h2 id="api-title" class="text-2xl font-semibold tracking-tight">API reference</h2>
				<div class="mt-5 overflow-x-auto rounded-lg border border-border">
					<table class="w-full text-left text-sm">
						<thead class="bg-muted/70 text-muted-foreground"
							><tr
								><th class="px-4 py-3 font-medium">Prop</th><th class="px-4 py-3 font-medium"
									>Type</th
								><th class="px-4 py-3 font-medium">Default</th>{#if hasApiDescriptions}<th
										class="px-4 py-3 font-medium">Description</th
									>{/if}</tr
							></thead
						>
						<tbody class="divide-y divide-border">
							{#each component.api as property (property.name)}
								<tr
									><td class="px-4 py-3 font-mono text-xs">{property.name}</td><td
										class="px-4 py-3 font-mono text-xs text-muted-foreground">{property.type}</td
									><td class="px-4 py-3 font-mono text-xs text-muted-foreground"
										>{property.default}</td
									>{#if hasApiDescriptions}<td
											class="min-w-64 px-4 py-3 text-xs leading-relaxed text-muted-foreground"
											>{property.description ?? '—'}</td
										>{/if}</tr
								>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		<section class="pt-12" aria-labelledby="source-title">
			<h2 id="source-title" class="text-2xl font-semibold tracking-tight">Source</h2>
			<p class="mt-3 text-muted-foreground">
				These files are included in the registry item and copied into the consuming project.
			</p>
			<div class="mt-5 space-y-5">
				{#each component.sources as source (source.name)}<Code
						code={source.code}
						language={languageFromFilename(source.name)}
						label={source.name}
					/>{/each}
			</div>
		</section>
	</div>
</main>
