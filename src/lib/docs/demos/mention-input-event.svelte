<script lang="ts">
	import {
		MentionInput,
		type MentionEvent,
		type MentionItem
	} from '$lib/components/ui/mention-input';
	import { Code } from '$lib/components/ui/code';

	const people: MentionItem[] = [
		{
			id: 'maya',
			label: 'Maya Chen',
			value: 'maya',
			description: 'Product design',
			data: { teamId: 'design', notify: true }
		},
		{
			id: 'alex',
			label: 'Alex Kim',
			value: 'alex',
			description: 'Engineering',
			data: { teamId: 'engineering', notify: true }
		}
	];

	let message = $state('Please review this with ');
	let lastEvent = $state<MentionEvent | null>(null);

	const eventJson = $derived(
		lastEvent
			? JSON.stringify(lastEvent, null, 2)
			: `{
  "item": { "id": "…", "label": "…", "data": {} },
  "trigger": "@",
  "query": "typed search text",
  "start": 24,
  "end": 27,
  "mention": "@maya",
  "value": "Complete value after insertion"
}`
	);
</script>

<div class="grid w-full gap-5 lg:grid-cols-2">
	<div class="space-y-3">
		<MentionInput
			items={people}
			bind:value={message}
			onMention={(event) => {
				lastEvent = event;
			}}
		/>
		<p class="text-xs leading-relaxed text-muted-foreground">
			Type <span class="font-mono text-foreground">@</span>, select a person, and inspect the exact
			payload passed to your callback.
		</p>
	</div>

	<div class="min-w-0">
		<Code
			code={eventJson}
			language="json"
			label={lastEvent ? 'Live MentionEvent' : 'MentionEvent shape'}
		/>
	</div>
</div>
