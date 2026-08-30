<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type TypewriterProps = HTMLAttributes<HTMLSpanElement> & {
		value: string | string[];
		loop?: boolean;
		speed?: number;
		pauseDuration?: number;
		startDelay?: number;
		showCursor?: boolean;
		cursorCharacter?: string;
		ariaLabel?: string;
		onPhraseChange?: (value: string, index: number) => void;
		onComplete?: () => void;
		cursorClass?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { cn } from '$lib/utils.js';

	let {
		value,
		loop = false,
		speed = 70,
		pauseDuration = 1200,
		startDelay = 0,
		showCursor = true,
		cursorCharacter = '|',
		ariaLabel,
		onPhraseChange,
		onComplete,
		cursorClass,
		class: className,
		...restProps
	}: TypewriterProps = $props();

	let displayedText = $state('');
	let phraseIndex = 0;
	let characterIndex = 0;
	let deleting = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let stopped = false;

	const phrases = $derived.by(() => {
		const entries = Array.isArray(value) ? value : [value];
		return entries.length ? entries : [''];
	});
	const accessibleText = $derived(ariaLabel ?? phrases.join(', '));

	function splitText(text: string) {
		if (typeof Intl.Segmenter === 'function') {
			const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
			return Array.from(segmenter.segment(text), ({ segment }) => segment);
		}

		return Array.from(text);
	}

	function clearTimer() {
		if (timer === undefined) return;
		clearTimeout(timer);
		timer = undefined;
	}

	function schedule(callback: () => void, delay: number) {
		clearTimer();
		timer = setTimeout(callback, Math.max(0, delay));
	}

	function finish() {
		clearTimer();
		onComplete?.();
	}

	function typeNextCharacter() {
		if (stopped) return;

		const currentIndex = Math.min(phraseIndex, phrases.length - 1);
		const phrase = phrases[currentIndex] ?? '';
		const characters = splitText(phrase);

		if (!deleting && characterIndex < characters.length) {
			characterIndex += 1;
			displayedText = characters.slice(0, characterIndex).join('');
			schedule(typeNextCharacter, speed);
			return;
		}

		const isLastPhrase = currentIndex === phrases.length - 1;
		if (!deleting && !loop && isLastPhrase) {
			finish();
			return;
		}

		if (!deleting) {
			deleting = true;
			schedule(typeNextCharacter, pauseDuration);
			return;
		}

		if (characterIndex > 0) {
			characterIndex -= 1;
			displayedText = characters.slice(0, characterIndex).join('');
			schedule(typeNextCharacter, speed);
			return;
		}

		deleting = false;
		phraseIndex = isLastPhrase ? 0 : currentIndex + 1;
		onPhraseChange?.(phrases[phraseIndex] ?? '', phraseIndex);
		schedule(typeNextCharacter, speed);
	}

	function start() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			phraseIndex = loop ? 0 : phrases.length - 1;
			displayedText = phrases[phraseIndex] ?? '';
			onComplete?.();
			return;
		}

		onPhraseChange?.(phrases[0] ?? '', 0);
		schedule(typeNextCharacter, startDelay);
	}

	const startWhenVisible: Attachment<HTMLSpanElement> = (element) => {
		stopped = false;

		if (typeof IntersectionObserver === 'undefined') {
			start();
			return () => {
				stopped = true;
				clearTimer();
			};
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				start();
			},
			{ threshold: 0.1 }
		);

		observer.observe(element);

		return () => {
			stopped = true;
			observer.disconnect();
			clearTimer();
		};
	};
</script>

<span
	{@attach startWhenVisible}
	{...restProps}
	data-slot="typewriter"
	class={cn('inline', className)}
>
	<span class="sr-only">{accessibleText}</span>
	<span aria-hidden="true">{displayedText}</span>{#if showCursor}<span
			aria-hidden="true"
			class={cn('typewriter-cursor inline-block', cursorClass)}>{cursorCharacter}</span
		>{/if}
</span>

<style>
	.typewriter-cursor {
		animation: typewriter-cursor-blink 0.8s step-end infinite;
	}

	@keyframes typewriter-cursor-blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.typewriter-cursor {
			animation: none;
		}
	}
</style>
