<script lang="ts">
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import { Button } from '$lib/components/ui/button';
	import { components } from '$lib/docs/catalog';
	import FileUploadPlayground from './file-upload-playground.svelte';
	import { getPlaygroundStatus } from './playground.remote';

	const status = getPlaygroundStatus();
	let selectedName = $state(components[0]?.name ?? '');
	const selected = $derived(components.find((component) => component.name === selectedName));
	const Demo = $derived(selected?.demo);
</script>

<svelte:head>
	<title>Component Playground — Codeworks UI</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="min-w-0 px-5 py-10 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-5xl space-y-8">
		<header
			class="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between"
		>
			<div>
				<p class="text-sm font-medium text-muted-foreground">Development only</p>
				<h1 class="mt-2 text-4xl font-bold tracking-tight">Component playground</h1>
				<p class="mt-3 max-w-2xl text-muted-foreground">
					Render any registered component demo and verify the remote-function connection without
					exposing this route in production.
				</p>
			</div>

			<label class="grid min-w-56 gap-1.5 text-sm font-medium">
				Component
				<select
					bind:value={selectedName}
					class="h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
				>
					{#each components as component (component.name)}
						<option value={component.name}>{component.title}</option>
					{/each}
				</select>
			</label>
		</header>

		<section
			class="rounded-xl border border-border bg-card p-5"
			aria-labelledby="remote-status-title"
		>
			<div class="flex items-center justify-between gap-4">
				<div>
					<h2 id="remote-status-title" class="font-semibold">Remote function</h2>
					{#if status.loading && !status.ready}
						<p class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
							<LoaderCircleIcon class="size-3.5 animate-spin" aria-hidden="true" />
							Connecting to the server…
						</p>
					{:else if status.error}
						<p class="mt-1 text-sm text-destructive">Remote function failed.</p>
					{:else if status.ready}
						<p class="mt-1 text-sm text-muted-foreground">
							{status.current.message} Environment: {status.current.environment}. Server time:
							{status.current.serverTime}.
						</p>
					{/if}
				</div>
				<Button
					variant="outline"
					size="sm"
					onclick={() => status.refresh()}
					disabled={status.loading}
				>
					<RefreshCwIcon class={status.loading ? 'animate-spin' : undefined} aria-hidden="true" />
					Refresh
				</Button>
			</div>
		</section>

		<section aria-labelledby="preview-title">
			<div class="mb-4">
				<h2 id="preview-title" class="text-2xl font-semibold tracking-tight">
					{selected?.title ?? 'Preview'}
				</h2>
				{#if selected}
					<p class="mt-1 text-sm text-muted-foreground">{selected.description}</p>
				{/if}
			</div>
			<div class="grid min-h-96 place-items-center rounded-xl border border-border bg-card p-8">
				{#if selectedName === 'file-dropzone'}
					<FileUploadPlayground />
				{:else if Demo}
					<Demo />
				{:else}
					<p class="text-sm text-muted-foreground">No component selected.</p>
				{/if}
			</div>
		</section>
	</div>
</main>
