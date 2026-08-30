<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import registry from '../../../registry.json';

	let { class: className }: { class?: string } = $props();

	type SearchItem = {
		name: string;
		title: string;
		description: string;
	};

	const items = (registry.items as Array<Record<string, unknown>>)
		.filter((item) => item.type === 'registry:ui')
		.map(
			(item) =>
				({
					name: String(item.name),
					title: String(item.title ?? item.name),
					description: String(item.description ?? '')
				}) satisfies SearchItem
		)
		.sort((a, b) => a.title.localeCompare(b.title));

	const searchId = $props.id();
	const listboxId = `${searchId}-results`;

	let query = $state('');
	let open = $state(false);
	let activeIndex = $state(0);

	const results = $derived.by(() => {
		const term = query.trim().toLocaleLowerCase();
		if (!term) return items.slice(0, 8);

		return items
			.filter((item) =>
				[item.title, item.name, item.description].some((value) =>
					value.toLocaleLowerCase().includes(term)
				)
			)
			.slice(0, 8);
	});

	const activeResult = $derived(open ? results[activeIndex] : undefined);

	function handleInput(event: Event) {
		query = (event.currentTarget as HTMLInputElement).value;
		activeIndex = 0;
		open = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			open = true;
			activeIndex = results.length ? (activeIndex + 1) % results.length : 0;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			open = true;
			activeIndex = results.length ? (activeIndex - 1 + results.length) % results.length : 0;
		} else if (event.key === 'Enter' && open && activeResult) {
			event.preventDefault();
			void select(activeResult);
		} else if (event.key === 'Escape') {
			open = false;
		}
	}

	function handleFocusOut(event: FocusEvent) {
		const container = event.currentTarget as HTMLDivElement;
		if (!container.contains(event.relatedTarget as Node | null)) open = false;
	}

	async function select(item: SearchItem) {
		open = false;
		query = '';
		await goto(resolve('/docs/components/[component]', { component: item.name }));
	}
</script>

<div
	class={cn('relative min-w-0 flex-1 sm:mx-auto sm:max-w-sm', className)}
	onfocusout={handleFocusOut}
>
	<label for={searchId} class="sr-only">Search components</label>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
	>
		<circle cx="11" cy="11" r="7"></circle>
		<path d="m20 20-3.5-3.5"></path>
	</svg>
	<input
		id={searchId}
		type="search"
		value={query}
		oninput={handleInput}
		onclick={() => (open = true)}
		onkeydown={handleKeydown}
		placeholder="Search components..."
		autocomplete="off"
		role="combobox"
		aria-autocomplete="list"
		aria-expanded={open}
		aria-controls={listboxId}
		aria-activedescendant={activeResult ? `${searchId}-${activeResult.name}` : undefined}
		class="h-9 w-full rounded-md border border-border bg-muted/40 pr-3 pl-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20"
	/>

	{#if open}
		<div
			id={listboxId}
			role="listbox"
			aria-label="Components"
			class="absolute top-full right-0 left-0 z-[60] mt-2 max-h-80 overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-xl"
		>
			{#each results as item, index (item.name)}
				<a
					id={`${searchId}-${item.name}`}
					href={resolve('/docs/components/[component]', { component: item.name })}
					role="option"
					aria-selected={index === activeIndex}
					onmouseenter={() => (activeIndex = index)}
					onclick={() => {
						open = false;
						query = '';
					}}
					class="block rounded-md px-3 py-2 text-sm aria-selected:bg-accent"
				>
					<span class="block font-medium text-foreground">{item.title}</span>
					<span class="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
						{item.description}
					</span>
				</a>
			{:else}
				<p class="px-3 py-5 text-center text-sm text-muted-foreground" role="status">
					No components found.
				</p>
			{/each}
		</div>
	{/if}
</div>
