<script lang="ts">
	import { Navbar, type NavbarItem } from '$lib/components/ui/navbar';

	const items: NavbarItem[] = [
		{ label: 'Home', href: '#home', active: true },
		{
			label: 'Products',
			href: '#products',
			description: 'Explore everything Acme can do for your team.',
			subroutes: [
				{
					label: 'Analytics',
					href: '#analytics',
					description: 'Understand performance with real-time insights.'
				},
				{
					label: 'Automations',
					href: '#automations',
					description: 'Turn repetitive work into dependable workflows.',
					badge: 'New'
				},
				{
					label: 'Integrations',
					href: '#integrations',
					description: 'Connect the tools your team already uses.'
				}
			]
		},
		{ label: 'About', href: '#about' },
		{ label: 'Contact', href: '#contact' }
	];
</script>

<div class="w-full overflow-hidden rounded-xl border border-border">
	<Navbar {items} brand="Acme" class="border-0" containerClass="max-w-5xl" />
</div>
