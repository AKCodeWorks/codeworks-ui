<script lang="ts">
	import * as Stat from '$lib/components/ui/stat';
</script>

<Stat.Root direction="responsive" class="w-full border border-border shadow-sm">
	<Stat.Item>
		<Stat.Title>Account balance</Stat.Title>
		<Stat.Value>$89,400</Stat.Value>
		<Stat.Actions>
			<button class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
				Add funds
			</button>
		</Stat.Actions>
	</Stat.Item>

	<Stat.Item class="place-items-center text-center">
		<Stat.Title>Active projects</Stat.Title>
		<Stat.Value class="text-violet-600">24</Stat.Value>
		<Stat.Description>Across 6 workspaces</Stat.Description>
	</Stat.Item>
</Stat.Root>
