<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type ErrorProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> & {
		status: number;
		error: App.Error | Error | string | null | undefined;
		title?: string;
		message?: string;
		homeHref?: string | null;
		homeLabel?: string;
		showRetry?: boolean;
		retryLabel?: string;
		onRetry?: () => void;
		children?: Snippet;
		class?: string;
		contentClass?: string;
		childrenClass?: string;
	};

	export function errorTitle(status: number) {
		const titles: Record<number, string> = {
			400: 'That request did not look right',
			401: 'Sign in to continue',
			403: 'You cannot access this page',
			404: 'This page wandered off',
			408: 'The request took too long',
			409: 'Something changed along the way',
			422: 'We could not process that',
			429: 'A little too much, too quickly',
			500: 'Something went wrong on our side',
			502: 'The server returned a bad response',
			503: 'We will be right back',
			504: 'The server took too long to respond'
		};

		return titles[status] ?? (status >= 500 ? 'Something went wrong' : 'We hit a problem');
	}
</script>

<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';

	let {
		status,
		error,
		title,
		message,
		homeHref = '/',
		homeLabel = 'Go home',
		showRetry = true,
		retryLabel = 'Try again',
		onRetry,
		children,
		class: className,
		contentClass,
		childrenClass,
		...restProps
	}: ErrorProps = $props();

	const componentId = $props.id();
	const titleId = `${componentId}-title`;
	const messageId = `${componentId}-message`;
	const resolvedTitle = $derived(title ?? errorTitle(status));
	const errorMessage = $derived(
		message ??
			(typeof error === 'string'
				? error
				: (error?.message ?? 'An unexpected error prevented this page from loading.'))
	);

	function retry() {
		if (onRetry) {
			onRetry();
			return;
		}

		window.location.reload();
	}
</script>

<div
	{...restProps}
	data-slot="error"
	data-status={status}
	role="alert"
	aria-labelledby={titleId}
	aria-describedby={messageId}
	class={cn(
		'relative isolate grid min-h-[70svh] w-full place-items-center overflow-hidden rounded-2xl bg-background px-6 py-16 text-center',
		className
	)}
>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-20 mx-auto h-80 max-w-3xl rounded-full bg-primary/8 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_70%)]"
	></div>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 -z-10 -translate-y-1/2 bg-gradient-to-b from-foreground/8 to-transparent bg-clip-text text-[clamp(10rem,35vw,24rem)] leading-none font-black tracking-tighter text-transparent select-none"
	>
		{status}
	</div>

	<div class={cn('flex w-full max-w-xl flex-col items-center', contentClass)}>
		<div
			class="mb-6 grid size-14 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-lg shadow-foreground/5"
		>
			<TriangleAlertIcon class="size-6" aria-hidden="true" />
		</div>
		<p
			class="rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase shadow-xs backdrop-blur"
		>
			Error {status}
		</p>
		<h1 id={titleId} class="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
			{resolvedTitle}
		</h1>
		<p id={messageId} class="mt-4 max-w-lg text-base leading-7 text-pretty text-muted-foreground">
			{errorMessage}
		</p>

		{#if homeHref || showRetry}
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
				{#if homeHref}
					<Button href={homeHref} size="lg">
						<ArrowLeftIcon aria-hidden="true" />
						{homeLabel}
					</Button>
				{/if}
				{#if showRetry}
					<Button variant="outline" size="lg" onclick={retry}>
						<RefreshCwIcon aria-hidden="true" />
						{retryLabel}
					</Button>
				{/if}
			</div>
		{/if}

		{#if children}
			<div class={cn('mt-10 w-full border-t border-border pt-6', childrenClass)}>
				{@render children()}
			</div>
		{/if}
	</div>
</div>
