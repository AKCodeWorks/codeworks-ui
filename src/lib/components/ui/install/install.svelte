<script lang="ts">
	import { onMount } from 'svelte';
	import { Tabs } from 'bits-ui';
	import { Code } from '$lib/components/ui/code';
	import { cw } from '$lib/utils';

	export type InstallValue = {
		value: string;
		command: string;
		label?: string;
		disabled?: boolean;
	};

	let {
		values,
		script,
		storageKey = 'codeworks-ui:package-manager',
		class: className
	}: {
		values: InstallValue[];
		script: string;
		storageKey?: string;
		class?: string;
	} = $props();

	let selected = $state('');
	const fallbackValue = $derived(values[0]?.value ?? '');
	const activeValue = $derived(
		values.some((option) => option.value === selected) ? selected : fallbackValue
	);

	onMount(() => {
		const validValues = new Set(values.map((option) => option.value));

		try {
			const storedValue = localStorage.getItem(storageKey);
			selected = storedValue && validValues.has(storedValue) ? storedValue : fallbackValue;
		} catch {
			selected = fallbackValue;
		}

		function syncSelection(event: StorageEvent) {
			if (event.key === storageKey && event.newValue && validValues.has(event.newValue)) {
				selected = event.newValue;
			}
		}

		window.addEventListener('storage', syncSelection);
		return () => window.removeEventListener('storage', syncSelection);
	});

	function select(value: string) {
		selected = value;

		try {
			localStorage.setItem(storageKey, value);
		} catch {
			// The switcher still works when storage is unavailable.
		}
	}

	function installCommand(option: InstallValue) {
		return [option.command.trim(), script.trim()].filter(Boolean).join(' ');
	}
</script>

{#if values.length}
	<Tabs.Root
		data-slot="install"
		value={activeValue}
		onValueChange={select}
		activationMode="automatic"
		class={cw('w-full', className)}
	>
		<Tabs.List
			aria-label="Package manager"
			class="inline-flex h-10 items-center rounded-lg border border-border bg-muted/50 p-1 text-muted-foreground"
		>
			{#each values as option (option.value)}
				<Tabs.Trigger
					value={option.value}
					disabled={option.disabled}
					class="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
				>
					{option.label ?? option.value}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>

		{#each values as option (option.value)}
			<Tabs.Content value={option.value} class="mt-3 focus-visible:outline-none">
				<Code code={installCommand(option)} language="shellscript" label="Terminal" />
			</Tabs.Content>
		{/each}
	</Tabs.Root>
{:else}
	<div
		data-slot="install"
		class={cw(
			'rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground',
			className
		)}
	>
		No install commands are available.
	</div>
{/if}
