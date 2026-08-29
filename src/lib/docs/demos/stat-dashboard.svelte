<script lang="ts">
	import * as Stat from '$lib/components/ui/stat';
</script>

<Stat.Root direction="responsive" class="w-full border border-border shadow-sm">
	<Stat.Item>
		<Stat.Figure class="text-violet-600">
			<svg aria-hidden="true" class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-width="2" d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
			</svg>
		</Stat.Figure>
		<Stat.Title>Downloads</Stat.Title>
		<Stat.Value>31K</Stat.Value>
		<Stat.Description>Jan 1 – Feb 1</Stat.Description>
	</Stat.Item>

	<Stat.Item>
		<Stat.Title>New users</Stat.Title>
		<Stat.Value class="text-emerald-600">4,200</Stat.Value>
		<Stat.Description class="text-emerald-600">↗ 400 (22%)</Stat.Description>
	</Stat.Item>

	<Stat.Item>
		<Stat.Title>New registrations</Stat.Title>
		<Stat.Value>1,200</Stat.Value>
		<Stat.Description>↘ 90 (14%)</Stat.Description>
	</Stat.Item>
</Stat.Root>
