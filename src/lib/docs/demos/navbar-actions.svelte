<script lang="ts">
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import UserIcon from '@lucide/svelte/icons/user';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Navbar, type NavbarItem } from '$lib/components/ui/navbar';

	const items: NavbarItem[] = [
		{
			label: 'Overview',
			href: '#overview',
			description: 'A quick look at your workspace.',
			active: true
		},
		{
			label: 'Platform',
			href: '#platform',
			description: 'Tools for shipping and operating your product.',
			subroutes: [
				{
					label: 'Deployments',
					href: '#deployments',
					description: 'Ship applications to every environment.'
				},
				{
					label: 'Observability',
					href: '#observability',
					description: 'Monitor health, performance, and usage.',
					badge: 'New'
				},
				{
					label: 'Security',
					href: '#security',
					description: 'Manage access and protect customer data.'
				}
			]
		},
		{ label: 'Changelog', href: '#changelog', badge: 'New' },
		{
			label: 'Documentation',
			href: 'https://example.com/docs',
			description: 'Guides, examples, and API references.',
			external: true
		}
	];
</script>

{#snippet brand()}
	<span class="grid size-8 place-items-center rounded-lg bg-primary text-xs text-primary-foreground"
		>A</span
	>
	<span class="ml-2">Acme Cloud</span>
{/snippet}

{#snippet actions()}
	<a
		href="#start"
		class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
		>Get started</a
	>
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="grid size-9 place-items-center rounded-full border border-border bg-muted text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			aria-label="Open account menu"
		>
			AK
		</ContextMenu.Trigger>
		<ContextMenu.Content class="w-52">
			<ContextMenu.Label>Alex Kim</ContextMenu.Label>
			<ContextMenu.Separator />
			<ContextMenu.Item><UserIcon />Profile</ContextMenu.Item>
			<ContextMenu.Item><CreditCardIcon />Billing</ContextMenu.Item>
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger><SettingsIcon />Preferences</ContextMenu.SubTrigger>
				<ContextMenu.SubContent class="w-44">
					<ContextMenu.Item>Appearance</ContextMenu.Item>
					<ContextMenu.Item>Notifications</ContextMenu.Item>
					<ContextMenu.Item>Security</ContextMenu.Item>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
			<ContextMenu.Separator />
			<ContextMenu.Item variant="destructive"><LogOutIcon />Sign out</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>
{/snippet}

{#snippet mobileFooter()}
	<div class="grid gap-2">
		<a
			href="#signin"
			class="rounded-md border border-border px-3 py-2 text-center text-sm font-medium"
		>
			Sign in
		</a>
		<a
			href="#start"
			class="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
		>
			Get started
		</a>
	</div>
{/snippet}

<div class="w-full overflow-hidden rounded-xl border border-border">
	<Navbar {items} {brand} {actions} {mobileFooter} class="border-0" containerClass="max-w-5xl" />
</div>
