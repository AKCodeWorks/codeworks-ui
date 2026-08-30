<script lang="ts">
	import EyeIcon from '@lucide/svelte/icons/eye';
	import LayoutListIcon from '@lucide/svelte/icons/layout-list';
	import Rows3Icon from '@lucide/svelte/icons/rows-3';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import * as ContextMenu from '$lib/components/ui/context-menu';

	let showDetails = $state(true);
	let compactRows = $state(false);
	let density = $state('comfortable');

	const projects = [
		{ name: 'Design system', detail: 'Updated 8 minutes ago', status: 'Active' },
		{ name: 'Mobile app', detail: 'Updated yesterday', status: 'Review' },
		{ name: 'Documentation', detail: 'Updated 3 days ago', status: 'Draft' }
	];
</script>

<div class="grid w-full max-w-xl gap-3">
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm select-none data-[state=open]:ring-2 data-[state=open]:ring-ring/30"
		>
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<div>
					<p class="font-medium">Recent projects</p>
					<p class="text-sm text-muted-foreground">Right-click to change this view</p>
				</div>
				<Settings2Icon class="size-5 text-muted-foreground" />
			</div>
			<div
				class="grid p-4"
				class:gap-1={density === 'compact'}
				class:gap-3={density === 'comfortable'}
			>
				{#each projects as project (project.name)}
					<div
						class="flex items-center gap-3 rounded-md bg-muted/50 px-3 text-sm transition-all"
						class:py-1={compactRows || density === 'compact'}
						class:py-3={!compactRows && density === 'comfortable'}
					>
						<div class="size-2 shrink-0 rounded-full bg-primary"></div>
						<div class="min-w-0 flex-1">
							<p class="font-medium">{project.name}</p>
							{#if showDetails}
								<p class="text-xs text-muted-foreground">{project.detail}</p>
							{/if}
						</div>
						{#if showDetails}
							<span
								class="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
							>
								{project.status}
							</span>
						{/if}
					</div>
				{/each}
			</div>
		</ContextMenu.Trigger>

		<ContextMenu.Content class="w-56">
			<ContextMenu.Group>
				<ContextMenu.GroupHeading>View options</ContextMenu.GroupHeading>
				<ContextMenu.CheckboxItem bind:checked={showDetails}>
					<EyeIcon />
					Show details
				</ContextMenu.CheckboxItem>
				<ContextMenu.CheckboxItem bind:checked={compactRows}>
					<Rows3Icon />
					Compact rows
				</ContextMenu.CheckboxItem>
			</ContextMenu.Group>

			<ContextMenu.Separator />
			<ContextMenu.RadioGroup bind:value={density}>
				<ContextMenu.Group>
					<ContextMenu.GroupHeading>Density</ContextMenu.GroupHeading>
					<ContextMenu.RadioItem value="comfortable">
						<LayoutListIcon />Comfortable
					</ContextMenu.RadioItem>
					<ContextMenu.RadioItem value="compact"><Rows3Icon />Compact</ContextMenu.RadioItem>
				</ContextMenu.Group>
			</ContextMenu.RadioGroup>

			<ContextMenu.Separator />
			<ContextMenu.Item disabled>Syncing unavailable</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>

	<p class="text-center text-xs text-muted-foreground" aria-live="polite">
		{density === 'comfortable' ? 'Comfortable' : 'Compact'} density · Details
		{showDetails ? 'shown' : 'hidden'} · Compact rows {compactRows ? 'on' : 'off'}
	</p>
</div>
