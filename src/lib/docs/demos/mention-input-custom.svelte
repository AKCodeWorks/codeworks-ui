<script lang="ts">
	import {
		MentionInput,
		type MentionEmptyContext,
		type MentionEvent,
		type MentionItem,
		type MentionSuggestionContext
	} from '$lib/components/ui/mention-input';

	let actionMessage = $state('Mention someone to run their action.');
	let message = $state('Can you review this with ');

	function runMentionAction(name: string) {
		return ({ mention }: MentionEvent) => {
			actionMessage = `${name} was notified from ${mention}.`;
		};
	}

	const people: MentionItem[] = [
		{
			id: 'maya',
			label: 'Maya Chen',
			value: 'maya',
			description: 'Product designer',
			keywords: ['design', 'figma'],
			onMention: runMentionAction('Maya')
		},
		{
			id: 'alex',
			label: 'Alex Kim',
			value: 'alex',
			description: 'Frontend engineer',
			keywords: ['engineering', 'svelte'],
			onMention: runMentionAction('Alex')
		},
		{
			id: 'jordan',
			label: 'Jordan Smith',
			value: 'jordan',
			description: 'Customer success',
			keywords: ['support', 'customers'],
			onMention: runMentionAction('Jordan')
		}
	];
</script>

{#snippet suggestion({ item, trigger }: MentionSuggestionContext)}
	<span
		class="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary"
	>
		{item.label
			.split(' ')
			.map((part) => part[0])
			.join('')}
	</span>
	<span class="min-w-0 flex-1">
		<span class="block truncate font-medium">{item.label}</span>
		<span class="block truncate text-xs text-muted-foreground">{item.description}</span>
	</span>
	<span class="rounded-full bg-muted px-2 py-1 font-mono text-[0.625rem] text-muted-foreground">
		{trigger}{item.value}
	</span>
{/snippet}

{#snippet empty({ query }: MentionEmptyContext)}
	<p>No teammate matches “{query}”.</p>
	<p class="mt-1 text-xs">Try a name, role, or tool.</p>
{/snippet}

<div class="w-full max-w-xl space-y-3">
	<MentionInput
		items={people}
		bind:value={message}
		{suggestion}
		{empty}
		placeholder="Ask a teammate…"
		class="rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-transparent p-px"
		inputClass="min-h-32 rounded-[calc(var(--radius-xl)-1px)] bg-background px-4 py-3"
		menuClass="rounded-xl p-2"
		itemClass="rounded-lg py-3"
	/>
	<div class="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
		{actionMessage}
	</div>
</div>
