<script lang="ts">
	import { Navbar, type NavbarItem } from '$lib/components/ui/navbar';

	const items: NavbarItem[] = [
		{ label: 'Dashboard', href: '#dashboard', description: 'Your account at a glance.' },
		{
			label: 'Team',
			href: '#team',
			description: 'Manage members and invitations.',
			subroutes: [
				{ label: 'Members', href: '#members', active: true },
				{ label: 'Invitations', href: '#invitations', badge: '2' },
				{ label: 'Permissions', href: '#permissions' }
			]
		},
		{ label: 'Billing', href: '#billing', description: 'Plans, invoices, and payment details.' },
		{ label: 'Labs', href: '#labs', description: 'Experimental features.', badge: 'Beta' }
	];
</script>

{#snippet mobileFooter()}
	<p class="text-xs leading-relaxed text-muted-foreground">
		Signed in as <span class="font-medium text-foreground">maya@example.com</span>
	</p>
{/snippet}

<div class="w-full overflow-hidden rounded-xl border border-border">
	<Navbar
		{items}
		brand="Workspace"
		forceMobile
		mobileSide="left"
		mobileTitle="Your workspace"
		mobileDescription="Jump to any area of your account."
		{mobileFooter}
		class="border-0"
	/>
</div>
