<script lang="ts">
	import {
		MentionInput,
		type MentionEvent,
		type MentionItem
	} from '$lib/components/ui/mention-input';

	const suggestions: MentionItem[] = [
		{ id: 'maya', label: 'Maya Chen', value: 'maya', trigger: '@', description: 'Person' },
		{ id: 'alex', label: 'Alex Kim', value: 'alex', trigger: '@', description: 'Person' },
		{
			id: 'design',
			label: 'design-system',
			value: 'design-system',
			trigger: '#',
			description: 'Channel'
		},
		{
			id: 'launch',
			label: 'launch-week',
			value: 'launch-week',
			trigger: '#',
			description: 'Channel'
		}
	];

	let message = $state('Share this with ');
	let lastAction = $state('Use @ for people or # for channels.');

	function handleMention(event: MentionEvent) {
		lastAction = `${event.trigger === '@' ? 'Person' : 'Channel'} selected: ${event.item.label}`;
	}
</script>

<div class="w-full max-w-xl space-y-3">
	<MentionInput
		items={suggestions}
		triggers={['@', '#']}
		bind:value={message}
		onMention={handleMention}
		formatMention={(item, trigger) => `${trigger}${item.value}`}
		placeholder="Type @maya or #design-system…"
	/>
	<div class="flex items-center justify-between gap-4 text-xs text-muted-foreground">
		<span>{lastAction}</span>
		<span class="shrink-0">{message.length} characters</span>
	</div>
</div>
