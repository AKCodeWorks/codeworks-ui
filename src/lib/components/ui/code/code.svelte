<script lang="ts">
	import { cw } from '$lib/utils';
	import { highlightCode, type CodeLanguage } from './highlighter';

	let {
		code,
		language = 'svelte',
		label = language,
		showCopy = true,
		class: className
	}: {
		code: string;
		language?: CodeLanguage;
		label?: string;
		showCopy?: boolean;
		class?: string;
	} = $props();

	let copied = $state(false);
	const lines = $derived(highlightCode(code, language));

	async function copy() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div
	data-slot="code"
	class={cw('overflow-hidden rounded-lg border border-border bg-foreground', className)}
>
	<div
		class="flex h-11 items-center justify-between border-b border-white/10 px-4 text-xs text-white/60"
	>
		<span>{label}</span>
		{#if showCopy}
			<button
				onclick={copy}
				class="rounded px-2 py-1 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
				aria-label={`Copy ${label}`}
			>
				{copied ? 'Copied' : 'Copy'}
			</button>
		{/if}
	</div>
	<pre class="max-h-[34rem] overflow-auto bg-foreground p-4 font-mono text-[13px] leading-6"><code
			class="grid min-w-max"
			>{#each lines as line, lineIndex (lineIndex)}<span class="min-h-6"
					>{#each line as token, tokenIndex (`${tokenIndex}-${token.content}`)}<span
							style:color={token.color}
							class:italic={Boolean(token.fontStyle && token.fontStyle & 1)}
							class:font-bold={Boolean(token.fontStyle && token.fontStyle & 2)}
							class:underline={Boolean(token.fontStyle && token.fontStyle & 4)}
							>{token.content}</span
						>{/each}</span
				>{/each}</code
		></pre>
</div>
