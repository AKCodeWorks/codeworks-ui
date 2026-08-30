<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export type NavigationProgressPosition = 'top' | 'bottom';
	export type NavigationProgressWaitFor =
		PromiseLike<unknown> | (() => PromiseLike<unknown> | undefined | void);

	export type NavigationProgressProps = Omit<HTMLAttributes<HTMLDivElement>, 'color'> & {
		position?: NavigationProgressPosition;
		maxProgress?: number;
		initialProgress?: number;
		trickleInterval?: number;
		transitionDuration?: number;
		completionDelay?: number;
		minDisplayTime?: number;
		waitFor?: NavigationProgressWaitFor;
		maxWaitTime?: number;
		height?: number;
		color?: string;
		zIndex?: number;
		trackNavigation?: boolean;
		trackPageData?: boolean;
		contained?: boolean;
		value?: number;
		ariaLabel?: string;
		onStart?: () => void;
		onComplete?: () => void;
		indicatorClass?: string;
		class?: string;
	};
</script>

<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onDestroy } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		position = 'top',
		maxProgress = 90,
		initialProgress = 8,
		trickleInterval = 250,
		transitionDuration = 200,
		completionDelay = 180,
		minDisplayTime = 0,
		waitFor,
		maxWaitTime = 30_000,
		height = 3,
		color,
		zIndex = 9999,
		trackNavigation = true,
		trackPageData = true,
		contained = false,
		value,
		ariaLabel = 'Navigation progress',
		onStart,
		onComplete,
		indicatorClass,
		class: className,
		...restProps
	}: NavigationProgressProps = $props();

	let progress = $state(0);
	let visible = $state(false);
	let trickleTimer: ReturnType<typeof setInterval> | undefined;
	let completionTimer: ReturnType<typeof setTimeout> | undefined;
	let resetTimer: ReturnType<typeof setTimeout> | undefined;
	let minimumTimer: ReturnType<typeof setTimeout> | undefined;
	let startedAt = 0;
	let navigationId = 0;

	const ceiling = $derived(clamp(maxProgress, Math.max(1, initialProgress), 99));
	const displayProgress = $derived(value === undefined ? progress : clamp(value, 0, 100));
	const displayVisible = $derived(value === undefined ? visible : value > 0);

	function clamp(input: number, minimum: number, maximum: number) {
		return Math.min(maximum, Math.max(minimum, input));
	}

	function clearTrickleTimer() {
		if (trickleTimer === undefined) return;
		clearInterval(trickleTimer);
		trickleTimer = undefined;
	}

	function clearCompletionTimer() {
		if (completionTimer === undefined) return;
		clearTimeout(completionTimer);
		completionTimer = undefined;
	}

	function clearResetTimer() {
		if (resetTimer === undefined) return;
		clearTimeout(resetTimer);
		resetTimer = undefined;
	}

	function clearMinimumTimer() {
		if (minimumTimer === undefined) return;
		clearTimeout(minimumTimer);
		minimumTimer = undefined;
	}

	function advance() {
		const remaining = ceiling - progress;
		if (remaining <= 0.25) {
			progress = ceiling;
			clearTrickleTimer();
			return;
		}

		progress = Math.min(ceiling, progress + Math.max(0.25, remaining * 0.08));
	}

	function start() {
		clearCompletionTimer();
		clearResetTimer();
		clearMinimumTimer();
		clearTrickleTimer();
		startedAt = performance.now();
		progress = clamp(initialProgress, 1, ceiling);
		visible = true;
		onStart?.();

		trickleTimer = setInterval(advance, Math.max(50, trickleInterval));
	}

	function finish() {
		clearTrickleTimer();
		progress = 100;
		onComplete?.();

		completionTimer = setTimeout(
			() => {
				visible = false;
				completionTimer = undefined;
				resetTimer = setTimeout(
					() => {
						progress = 0;
						resetTimer = undefined;
					},
					Math.max(0, transitionDuration)
				);
			},
			Math.max(0, completionDelay)
		);
	}

	function complete() {
		const remaining = Math.max(0, minDisplayTime - (performance.now() - startedAt));
		if (remaining === 0) {
			finish();
			return;
		}

		minimumTimer = setTimeout(() => {
			minimumTimer = undefined;
			finish();
		}, remaining);
	}

	async function waitForPageWork() {
		const pending: PromiseLike<unknown>[] = [];

		if (trackPageData) {
			for (const value of Object.values(page.data)) {
				if (isPromiseLike(value)) pending.push(value);
			}
		}

		try {
			const additionalWork = typeof waitFor === 'function' ? waitFor() : waitFor;
			if (isPromiseLike(additionalWork) && !pending.includes(additionalWork)) {
				pending.push(additionalWork);
			}
		} catch {
			// A readiness callback should not prevent navigation from completing.
		}

		if (pending.length === 0) return;

		let timeout: ReturnType<typeof setTimeout> | undefined;
		const safetyLimit = Math.max(0, maxWaitTime);
		const pageWork = Promise.allSettled(pending.map((work) => Promise.resolve(work)));

		if (safetyLimit === 0) {
			await pageWork;
			return;
		}

		await Promise.race([
			pageWork,
			new Promise<void>((resolve) => {
				timeout = setTimeout(resolve, safetyLimit);
			})
		]);

		if (timeout !== undefined) clearTimeout(timeout);
	}

	function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
		if ((typeof value !== 'object' || value === null) && typeof value !== 'function') return false;
		return typeof (value as { then?: unknown }).then === 'function';
	}

	async function completeAfterPageWork(id: number) {
		await waitForPageWork();
		if (id === navigationId) complete();
	}

	onNavigate(() => {
		if (!trackNavigation || value !== undefined) return;

		const id = ++navigationId;
		start();
		return () => {
			void completeAfterPageWork(id);
		};
	});

	onDestroy(() => {
		navigationId += 1;
		clearTrickleTimer();
		clearCompletionTimer();
		clearResetTimer();
		clearMinimumTimer();
	});
</script>

<div
	{...restProps}
	data-slot="navigation-progress"
	data-position={position}
	data-state={displayVisible ? 'loading' : 'idle'}
	role="progressbar"
	aria-label={ariaLabel}
	aria-hidden={!displayVisible}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={Math.round(displayProgress)}
	class={cn(
		'pointer-events-none inset-x-0 overflow-hidden transition-opacity motion-reduce:transition-none',
		contained ? 'absolute' : 'fixed',
		position === 'top' ? 'top-0' : 'bottom-0',
		displayVisible ? 'opacity-100' : 'opacity-0',
		className
	)}
	style:height={`${Math.max(1, height)}px`}
	style:z-index={zIndex}
	style:transition-duration={`${Math.max(0, transitionDuration)}ms`}
>
	<div
		data-slot="navigation-progress-indicator"
		class={cn(
			'h-full w-full origin-left bg-primary shadow-sm transition-transform ease-out motion-reduce:transition-none',
			indicatorClass
		)}
		style:background-color={color}
		style:transform={`scaleX(${displayProgress / 100})`}
		style:transition-duration={`${Math.max(0, transitionDuration)}ms`}
	></div>
</div>
