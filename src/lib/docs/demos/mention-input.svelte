<script lang="ts">
	import { MentionInput, type MentionItem } from '$lib/components/ui/mention-input';

	const people: MentionItem[] = [
		{ id: 'maya', label: 'Maya Chen', value: 'maya', description: 'Product design' },
		{ id: 'alex', label: 'Alex Kim', value: 'alex', description: 'Engineering' },
		{ id: 'jordan', label: 'Jordan Smith', value: 'jordan', description: 'Customer success' }
	];

	let message = $state('');
</script>

<div class="w-full max-w-xl space-y-3">
	<MentionInput items={people} bind:value={message} placeholder="Write a message and type @…" />
	<p class="text-xs text-muted-foreground">
		{message || 'Your message will appear here.'}
	</p>
</div>
