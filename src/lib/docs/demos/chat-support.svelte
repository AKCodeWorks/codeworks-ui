<script lang="ts">
	import * as Chat from '$lib/components/ui/chat';

	type Message = {
		id: number;
		side: 'left' | 'right';
		content: string;
		sentAt: string;
		status?: string;
	};

	let draft = $state('');
	let nextId = 4;
	let messages = $state<Message[]>([
		{
			id: 1,
			side: 'left',
			content: 'Hi! I found the issue with your preview deployment.',
			sentAt: '10:24 AM'
		},
		{
			id: 2,
			side: 'right',
			content: 'Great — was it the forwarded host configuration?',
			sentAt: '10:25 AM',
			status: 'Read'
		},
		{
			id: 3,
			side: 'left',
			content:
				'Exactly. I added the two proxy headers and the generated registry URL is correct now.',
			sentAt: '10:26 AM'
		}
	]);

	function sendMessage(content: string) {
		messages.push({
			id: nextId++,
			side: 'right',
			content,
			sentAt: new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(
				new Date()
			),
			status: 'Sent'
		});
	}
</script>

<Chat.Root class="h-[32rem] w-full max-w-xl shadow-sm">
	<header class="flex items-center gap-3 border-b border-border px-4 py-3">
		<img
			class="size-9 rounded-full object-cover"
			src="https://github.com/shadcn.png"
			alt="Maya's avatar"
		/>
		<div class="min-w-0">
			<p class="truncate text-sm font-semibold">Maya from Support</p>
			<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
				<span class="size-1.5 rounded-full bg-emerald-500"></span>Online
			</p>
		</div>
	</header>

	<Chat.Messages aria-label="Support conversation">
		{#each messages as message (message.id)}
			<Chat.Message side={message.side}>
				{#if message.side === 'left'}
					<img
						class="size-7 rounded-full object-cover"
						src="https://github.com/shadcn.png"
						alt=""
					/>
				{/if}
				<div
					class="flex max-w-[80%] flex-col gap-1"
					class:items-start={message.side === 'left'}
					class:items-end={message.side === 'right'}
				>
					<Chat.Content class="max-w-none">{message.content}</Chat.Content>
					<p class="px-1 text-[0.6875rem] text-muted-foreground">
						{message.sentAt}{message.status ? ` · ${message.status}` : ''}
					</p>
				</div>
			</Chat.Message>
		{/each}
	</Chat.Messages>
	<Chat.Composer bind:value={draft} onSend={sendMessage} />
</Chat.Root>
