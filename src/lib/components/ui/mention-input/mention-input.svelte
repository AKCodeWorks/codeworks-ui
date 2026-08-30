<script lang="ts" module>
	export type MentionEvent = {
		item: MentionItem;
		trigger: string;
		query: string;
		start: number;
		end: number;
		mention: string;
		value: string;
	};

	export type MentionAction = (event: MentionEvent) => void | Promise<void>;

	export type MentionItem = {
		id: string;
		label: string;
		value?: string;
		description?: string;
		keywords?: string[];
		trigger?: string;
		disabled?: boolean;
		data?: unknown;
		onMention?: MentionAction;
	};

	export type MentionSuggestionContext = {
		item: MentionItem;
		active: boolean;
		query: string;
		trigger: string;
	};

	export type MentionEmptyContext = {
		query: string;
		trigger: string;
	};
</script>

<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { cn } from '$lib/utils.js';

	type MentionMatch = {
		trigger: string;
		query: string;
		start: number;
		end: number;
	};

	type MentionInputProps = {
		items: MentionItem[];
		value?: string;
		onValueChange?: (value: string) => void;
		onMention?: MentionAction;
		onSearch?: (query: string, trigger: string) => void | Promise<void>;
		filter?: (item: MentionItem, query: string, trigger: string) => boolean;
		formatMention?: (item: MentionItem, trigger: string) => string;
		triggers?: string[];
		minQueryLength?: number;
		maxSuggestions?: number;
		allowSpaces?: boolean;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		placeholder?: string;
		ariaLabel?: string;
		rows?: number;
		id?: string;
		name?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		maxLength?: number;
		autocomplete?: 'on' | 'off';
		suggestion?: Snippet<[MentionSuggestionContext]>;
		empty?: Snippet<[MentionEmptyContext]>;
		class?: string;
		inputClass?: string;
		menuClass?: string;
		itemClass?: string;
		emptyClass?: string;
	};

	let {
		items,
		value = $bindable(''),
		onValueChange,
		onMention,
		onSearch,
		filter,
		formatMention,
		triggers = ['@'],
		minQueryLength = 0,
		maxSuggestions = 8,
		allowSpaces = false,
		open = $bindable(false),
		onOpenChange,
		placeholder = 'Type @ to mention…',
		ariaLabel = 'Mention input',
		rows = 4,
		id,
		name,
		disabled = false,
		readonly = false,
		required = false,
		maxLength,
		autocomplete = 'off',
		suggestion,
		empty,
		class: className,
		inputClass,
		menuClass,
		itemClass,
		emptyClass
	}: MentionInputProps = $props();

	const generatedId = $props.id();
	const inputId = $derived(id ?? `${generatedId}-input`);
	const listboxId = $derived(`${generatedId}-suggestions`);

	let textarea: HTMLTextAreaElement | undefined;
	let currentMatch = $state<MentionMatch | null>(null);
	let activeIndex = $state(0);
	let blurTimer: ReturnType<typeof setTimeout> | undefined;

	const suggestions = $derived.by(() => {
		const match = currentMatch;
		if (!match || match.query.length < minQueryLength) return [];

		const query = match.query.toLocaleLowerCase();
		return items
			.filter((item) => {
				if (item.trigger && item.trigger !== match.trigger) return false;
				if (filter) return filter(item, match.query, match.trigger);

				return [item.label, item.value, ...(item.keywords ?? [])]
					.filter((candidate): candidate is string => Boolean(candidate))
					.some((candidate) => candidate.toLocaleLowerCase().includes(query));
			})
			.slice(0, Math.max(0, maxSuggestions));
	});

	const activeItem = $derived(suggestions[activeIndex]);

	const captureTextarea: Attachment<HTMLTextAreaElement> = (node) => {
		textarea = node;

		return () => {
			if (textarea === node) textarea = undefined;
		};
	};

	function setOpen(nextOpen: boolean) {
		if (open === nextOpen) return;
		open = nextOpen;
		onOpenChange?.(nextOpen);
	}

	function findMention(text: string, cursor: number): MentionMatch | null {
		const beforeCursor = text.slice(0, cursor);
		let match: MentionMatch | null = null;

		for (const trigger of triggers.filter(Boolean)) {
			const start = beforeCursor.lastIndexOf(trigger);
			if (start < 0 || (match && start <= match.start)) continue;

			const precedingCharacter = beforeCursor[start - 1];
			if (precedingCharacter && !/[\s([{]/.test(precedingCharacter)) continue;

			const query = beforeCursor.slice(start + trigger.length);
			if (query.includes('\n') || (!allowSpaces && /\s/.test(query))) continue;

			match = { trigger, query, start, end: cursor };
		}

		return match;
	}

	function syncMention(notifySearch = false) {
		if (!textarea || disabled || readonly) return;

		currentMatch = findMention(value, textarea.selectionStart ?? value.length);
		activeIndex = 0;
		setOpen(Boolean(currentMatch && currentMatch.query.length >= minQueryLength));

		if (notifySearch && currentMatch) {
			void onSearch?.(currentMatch.query, currentMatch.trigger);
		}
	}

	function handleInput(event: Event) {
		value = (event.currentTarget as HTMLTextAreaElement).value;
		onValueChange?.(value);
		syncMention(true);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open || !currentMatch) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			setOpen(false);
			return;
		}

		if (!suggestions.length) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = (activeIndex + 1) % suggestions.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = (activeIndex - 1 + suggestions.length) % suggestions.length;
		} else if (event.key === 'Enter' || event.key === 'Tab') {
			event.preventDefault();
			if (activeItem && !activeItem.disabled) void selectMention(activeItem);
		}
	}

	function handleBlur() {
		blurTimer = setTimeout(() => setOpen(false), 100);
	}

	function handleFocus() {
		if (blurTimer) clearTimeout(blurTimer);
	}

	async function selectMention(item: MentionItem) {
		if (!currentMatch || item.disabled) return;

		const match = currentMatch;
		const mention =
			formatMention?.(item, match.trigger) ?? `${match.trigger}${item.value ?? item.label}`;
		const afterMention = value.slice(match.end);
		const existingSpace = afterMention.match(/^[\t ]/)?.[0] ?? '';
		const suffix = existingSpace ? '' : ' ';
		const nextValue = `${value.slice(0, match.start)}${mention}${suffix}${afterMention}`;
		const caret = match.start + mention.length + (suffix || existingSpace).length;

		value = nextValue;
		onValueChange?.(nextValue);
		currentMatch = null;
		setOpen(false);

		await tick();
		textarea?.focus();
		textarea?.setSelectionRange(caret, caret);

		const mentionEvent: MentionEvent = {
			item,
			trigger: match.trigger,
			query: match.query,
			start: match.start,
			end: match.end,
			mention,
			value: nextValue
		};

		void item.onMention?.(mentionEvent);
		void onMention?.(mentionEvent);
	}
</script>

<div data-slot="mention-input" class={cn('relative w-full', className)}>
	<textarea
		{@attach captureTextarea}
		id={inputId}
		{name}
		{rows}
		{disabled}
		{readonly}
		{required}
		maxlength={maxLength}
		{autocomplete}
		{placeholder}
		{value}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onclick={() => syncMention(false)}
		onselect={() => syncMention(false)}
		onfocus={handleFocus}
		onblur={handleBlur}
		role="combobox"
		aria-label={ariaLabel}
		aria-autocomplete="list"
		aria-expanded={open && Boolean(currentMatch)}
		aria-controls={listboxId}
		aria-activedescendant={open && activeItem ? `${listboxId}-${activeIndex}` : undefined}
		class={cn(
			'min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
			inputClass
		)}></textarea>

	{#if open && currentMatch}
		<div
			id={listboxId}
			role="listbox"
			aria-label={`${currentMatch.trigger} mention suggestions`}
			class={cn(
				'absolute top-full right-0 left-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg',
				menuClass
			)}
		>
			{#each suggestions as item, index (item.id)}
				<button
					id={`${listboxId}-${index}`}
					type="button"
					role="option"
					aria-selected={index === activeIndex}
					disabled={item.disabled}
					onmouseenter={() => (activeIndex = index)}
					onpointerdown={(event) => event.preventDefault()}
					onclick={() => selectMention(item)}
					class={cn(
						'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 aria-selected:bg-accent aria-selected:text-accent-foreground',
						itemClass
					)}
				>
					{#if suggestion}
						{@render suggestion({
							item,
							active: index === activeIndex,
							query: currentMatch.query,
							trigger: currentMatch.trigger
						})}
					{:else}
						<span class="min-w-0 flex-1">
							<span class="block truncate font-medium">{item.label}</span>
							{#if item.description}
								<span class="mt-0.5 block truncate text-xs text-muted-foreground">
									{item.description}
								</span>
							{/if}
						</span>
					{/if}
				</button>
			{:else}
				<div class={cn('px-3 py-6 text-center text-sm text-muted-foreground', emptyClass)}>
					{#if empty}
						{@render empty({ query: currentMatch.query, trigger: currentMatch.trigger })}
					{:else}
						No matches for “{currentMatch.query}”.
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
