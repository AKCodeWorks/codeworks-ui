<script lang="ts">
	import * as Steps from '$lib/components/ui/steps';
</script>

<div class="grid w-full max-w-4xl gap-8 lg:grid-cols-[16rem_1fr]">
	<div>
		<p class="mb-4 text-sm font-medium">Vertical</p>
		<Steps.Root direction="vertical">
			<Steps.Item state="complete">Account</Steps.Item>
			<Steps.Item state="current">Profile</Steps.Item>
			<Steps.Item>Preferences</Steps.Item>
		</Steps.Root>
	</div>

	<div>
		<p class="mb-4 text-sm font-medium">Responsive</p>
		<Steps.Root direction="responsive">
			<Steps.Item state="complete" indicator={1}>Draft</Steps.Item>
			<Steps.Item state="current" indicator={2}>Review</Steps.Item>
			<Steps.Item indicator={3}>Approve</Steps.Item>
			<Steps.Item indicator={4}>Publish</Steps.Item>
		</Steps.Root>
	</div>
</div>
