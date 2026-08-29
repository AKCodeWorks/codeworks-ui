<script lang="ts">
	import type { Snippet } from 'svelte';
	import { LinkPreview as LinkPreviewPrimitive } from 'bits-ui';
	import { cw } from '$lib/utils';

	let {
		href,
		children,
		title,
		target,
		rel,
		openDelay = 300,
		closeDelay = 150,
		disabled = false,
		class: className,
		contentClass,
		iframeClass
	}: {
		href: string;
		children?: Snippet;
		title?: string;
		target?: '_self' | '_blank' | '_parent' | '_top';
		rel?: string;
		openDelay?: number;
		closeDelay?: number;
		disabled?: boolean;
		class?: string;
		contentClass?: string;
		iframeClass?: string;
	} = $props();

	let open = $state(false);
	let loading = $state(true);
	const frameTitle = $derived(title ?? `Preview of ${href}`);

	function handleOpenChange(nextOpen: boolean) {
		open = nextOpen;
		if (nextOpen) loading = true;
	}
</script>

<LinkPreviewPrimitive.Root
	{open}
	onOpenChange={handleOpenChange}
	{openDelay}
	{closeDelay}
	{disabled}
>
	<LinkPreviewPrimitive.Trigger>
		{#snippet child({ props })}
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				{...props}
				{href}
				{target}
				{rel}
				role={undefined}
				class={cw(
					'font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
					className
				)}
			>
				{#if children}
					{@render children()}
				{:else}
					{href}
				{/if}
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		{/snippet}
	</LinkPreviewPrimitive.Trigger>

	<LinkPreviewPrimitive.Portal>
		<LinkPreviewPrimitive.Content
			sideOffset={8}
			collisionPadding={16}
			class={cw(
				'bg-popover text-popover-foreground z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border shadow-xl outline-none',
				contentClass
			)}
		>
			<div class="relative h-56 bg-muted">
				{#if open}
					<iframe
						src={href}
						title={frameTitle}
						loading="lazy"
						sandbox=""
						onload={() => (loading = false)}
						class={cw('h-full w-full border-0 bg-background', iframeClass)}
					></iframe>
				{/if}
				{#if loading}
					<div
						class="absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground"
					>
						Loading preview…
					</div>
				{/if}
			</div>
			<div
				class="truncate border-t border-border px-3 py-2 font-mono text-xs text-muted-foreground"
			>
				{href}
			</div>
		</LinkPreviewPrimitive.Content>
	</LinkPreviewPrimitive.Portal>
</LinkPreviewPrimitive.Root>
