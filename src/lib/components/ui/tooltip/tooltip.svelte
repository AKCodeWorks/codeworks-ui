<script lang="ts" module>
	export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
	export type TooltipAlign = 'start' | 'center' | 'end';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tooltip as TooltipPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type TooltipProps = {
		children: Snippet;
		content: string | Snippet;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		side?: TooltipSide;
		align?: TooltipAlign;
		sideOffset?: number;
		delayDuration?: number;
		disabled?: boolean;
		tapToOpen?: boolean;
		showArrow?: boolean;
		class?: string;
		contentClass?: string;
	};

	let {
		children,
		content,
		open = $bindable(false),
		onOpenChange,
		side = 'top',
		align = 'center',
		sideOffset = 8,
		delayDuration = 300,
		disabled = false,
		tapToOpen = true,
		showArrow = true,
		class: className,
		contentClass
	}: TooltipProps = $props();

	function handleOpenChange(nextOpen: boolean) {
		open = nextOpen;
		onOpenChange?.(nextOpen);
	}

	function handlePointerDown(event: PointerEvent) {
		if (!tapToOpen || disabled || event.pointerType === 'mouse') return;
		open = !open;
		onOpenChange?.(open);
	}
</script>

<TooltipPrimitive.Provider {delayDuration} {disabled} disableCloseOnTriggerClick={tapToOpen}>
	<TooltipPrimitive.Root
		bind:open
		{delayDuration}
		{disabled}
		disableCloseOnTriggerClick={tapToOpen}
		onOpenChange={handleOpenChange}
	>
		<TooltipPrimitive.Trigger>
			{#snippet child({ props })}
				<span
					{...props}
					onpointerdown={handlePointerDown}
					class={cn(
						'inline-flex max-w-full touch-manipulation rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
						className
					)}
				>
					{@render children()}
				</span>
			{/snippet}
		</TooltipPrimitive.Trigger>

		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				{side}
				{align}
				{sideOffset}
				collisionPadding={12}
				sticky="always"
				class={cn(
					'z-50 max-w-[min(20rem,calc(100vw-2rem))] rounded-md bg-foreground px-3 py-1.5 text-xs leading-relaxed text-background shadow-md outline-none',
					contentClass
				)}
			>
				{#if typeof content === 'string'}
					{content}
				{:else}
					{@render content()}
				{/if}
				{#if showArrow}
					<TooltipPrimitive.Arrow class="fill-foreground" />
				{/if}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	</TooltipPrimitive.Root>
</TooltipPrimitive.Provider>
