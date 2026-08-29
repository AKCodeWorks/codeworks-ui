<script lang="ts">
	import * as Chat from '$lib/components/ui/chat';

	let draft = $state('');
	let nextId = 3;
	let messages = $state([
		{ id: 1, side: 'left' as const, content: 'Hey! How are you?' },
		{ id: 2, side: 'right' as const, content: 'Doing well — thanks!' }
	]);

	function sendMessage(content: string) {
		messages.push({ id: nextId++, side: 'right', content });
	}
</script>

<Chat.Root class="h-80 w-full max-w-xl shadow-sm">
	<Chat.Messages aria-label="Basic conversation">
		{#each messages as message (message.id)}
			<Chat.Message side={message.side}>
				<Chat.Content>{message.content}</Chat.Content>
			</Chat.Message>
		{/each}
	</Chat.Messages>
	<Chat.Composer bind:value={draft} onSend={sendMessage} />
</Chat.Root>
