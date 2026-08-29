<script lang="ts">
	import * as Chat from '$lib/components/ui/chat';
</script>

<Chat.Root class="h-[32rem] w-full max-w-xl shadow-sm">
	<header class="border-b border-border px-4 py-3">
		<p class="text-sm font-semibold">Design handoff</p>
		<p class="text-xs text-muted-foreground">3 people · Project chat</p>
	</header>

	<Chat.Messages aria-label="Project conversation" class="gap-5">
		<Chat.Message side="left">
			<div
				aria-hidden="true"
				class="grid size-8 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-medium text-violet-700"
			>
				AK
			</div>
			<div class="flex max-w-[80%] flex-col items-start gap-1">
				<p class="px-1 text-xs font-medium text-muted-foreground">Alex Kim</p>
				<Chat.Content class="max-w-none">
					<p>The updated conversation flow is ready for review.</p>
					<div
						class="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3 text-foreground"
					>
						<div
							class="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700"
						>
							FIG
						</div>
						<div class="min-w-0">
							<p class="truncate text-xs font-semibold">chat-flow.fig</p>
							<p class="text-[0.6875rem] text-muted-foreground">4.2 MB · Figma file</p>
						</div>
					</div>
				</Chat.Content>
				<time class="px-1 text-[0.6875rem] text-muted-foreground" datetime="2026-08-29T14:18:00">
					2:18 PM
				</time>
			</div>
		</Chat.Message>

		<div class="flex items-center gap-3 text-[0.6875rem] text-muted-foreground">
			<span class="h-px flex-1 bg-border"></span>
			Today
			<span class="h-px flex-1 bg-border"></span>
		</div>

		<Chat.Message>
			<div class="flex max-w-[80%] flex-col items-end gap-1">
				<Chat.Content class="max-w-none">
					Looks great. I especially like that message content can contain any markup.
				</Chat.Content>
				<div class="flex items-center gap-1 px-1 text-[0.6875rem] text-muted-foreground">
					<time datetime="2026-08-29T14:21:00">2:21 PM</time>
					<span aria-hidden="true">·</span>
					<span>Delivered ✓✓</span>
				</div>
			</div>
		</Chat.Message>

		<Chat.Message side="left">
			<div
				aria-hidden="true"
				class="grid size-8 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-medium text-amber-800"
			>
				JS
			</div>
			<div class="flex max-w-[80%] flex-col items-start gap-1">
				<p class="px-1 text-xs font-medium text-muted-foreground">Jordan Smith</p>
				<Chat.Content class="max-w-none">Ship it 🚀</Chat.Content>
				<time class="px-1 text-[0.6875rem] text-muted-foreground" datetime="2026-08-29T14:22:00">
					2:22 PM
				</time>
			</div>
		</Chat.Message>
	</Chat.Messages>
</Chat.Root>
