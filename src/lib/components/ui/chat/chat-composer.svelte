<script lang="ts">
	import type {
		HTMLButtonAttributes,
		HTMLFormAttributes,
		HTMLTextareaAttributes
	} from 'svelte/elements';
	import { cw } from '$lib/utils';

	type ComposerProps = Omit<HTMLFormAttributes, 'onsubmit'> & {
		value?: string;
		onSend?: (message: string) => void | Promise<void>;
		placeholder?: string;
		label?: string;
		sendLabel?: string;
		disabled?: boolean;
		clearOnSend?: boolean;
		submitOnEnter?: boolean;
		rows?: number;
		class?: string;
		textareaClass?: string;
		buttonClass?: string;
		textareaProps?: Omit<
			HTMLTextareaAttributes,
			'value' | 'class' | 'disabled' | 'placeholder' | 'rows' | 'onkeydown'
		>;
		buttonProps?: Omit<HTMLButtonAttributes, 'type' | 'class' | 'disabled'>;
	};

	let {
		value = $bindable(''),
		onSend,
		placeholder = 'Type a message…',
		label = 'Message',
		sendLabel = 'Send',
		disabled = false,
		clearOnSend = true,
		submitOnEnter = true,
		rows = 1,
		class: className,
		textareaClass,
		buttonClass,
		textareaProps,
		buttonProps,
		...restProps
	}: ComposerProps = $props();

	const inputId = $props.id();
	let submitting = $state(false);
	const cannotSend = $derived(disabled || submitting || value.trim().length === 0);

	async function send(event: SubmitEvent) {
		event.preventDefault();
		const message = value.trim();
		if (!message || disabled || submitting) return;

		submitting = true;
		try {
			await onSend?.(message);
			if (clearOnSend) value = '';
		} finally {
			submitting = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (
			!submitOnEnter ||
			event.key !== 'Enter' ||
			event.shiftKey ||
			event.isComposing ||
			disabled ||
			submitting
		) {
			return;
		}

		event.preventDefault();
		(event.currentTarget as HTMLTextAreaElement).form?.requestSubmit();
	}
</script>

<form
	{...restProps}
	data-slot="chat-composer"
	class={cw('flex items-end gap-2 border-t border-border bg-background p-3', className)}
	onsubmit={send}
>
	<label class="sr-only" for={inputId}>{label}</label>
	<textarea
		{...textareaProps}
		id={inputId}
		data-slot="chat-input"
		bind:value
		{rows}
		{placeholder}
		disabled={disabled || submitting}
		onkeydown={handleKeydown}
		class={cw(
			'max-h-40 min-h-10 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
			textareaClass
		)}></textarea>
	<button
		{...buttonProps}
		type="submit"
		data-slot="chat-send"
		disabled={cannotSend}
		class={cw(
			'inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
			buttonClass
		)}
	>
		{submitting ? 'Sending…' : sendLabel}
	</button>
</form>
