<script lang="ts" module>
	export type NavbarSubroute = {
		label: string;
		href: string;
		description?: string;
		badge?: string;
		active?: boolean;
		disabled?: boolean;
		external?: boolean;
	};

	export type NavbarItem = NavbarSubroute & {
		subroutes?: NavbarSubroute[];
		showParentLink?: boolean;
		popoverClass?: string;
		subroutesClass?: string;
		mobileShowDescriptions?: boolean;
	};

	export type NavbarBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	export type NavbarMobileSide = 'left' | 'right';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { cn } from '$lib/utils.js';

	type NavbarProps = HTMLAttributes<HTMLElement> & {
		items: NavbarItem[];
		brand?: string | Snippet;
		brandHref?: string;
		actions?: Snippet;
		mobileActions?: Snippet;
		mobileFooter?: Snippet;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		breakpoint?: NavbarBreakpoint;
		forceMobile?: boolean;
		mobileSide?: NavbarMobileSide;
		mobileTitle?: string;
		mobileDescription?: string;
		ariaLabel?: string;
		containerClass?: string;
		contentClass?: string;
		class?: string;
	};

	let {
		items,
		brand = 'Brand',
		brandHref = '/',
		actions,
		mobileActions,
		mobileFooter,
		open = $bindable(false),
		onOpenChange,
		breakpoint = 'md',
		forceMobile = false,
		mobileSide = 'right',
		mobileTitle = 'Navigation',
		mobileDescription = 'Browse the site navigation.',
		ariaLabel = 'Main navigation',
		containerClass,
		contentClass,
		class: className,
		...restProps
	}: NavbarProps = $props();

	const desktopVisibility: Record<NavbarBreakpoint, string> = {
		sm: 'hidden sm:flex',
		md: 'hidden md:flex',
		lg: 'hidden lg:flex',
		xl: 'hidden xl:flex',
		'2xl': 'hidden 2xl:flex'
	};

	const mobileVisibility: Record<NavbarBreakpoint, string> = {
		sm: 'sm:hidden',
		md: 'md:hidden',
		lg: 'lg:hidden',
		xl: 'xl:hidden',
		'2xl': '2xl:hidden'
	};

	const desktopClass = $derived(forceMobile ? 'hidden' : desktopVisibility[breakpoint]);
	const mobileClass = $derived(forceMobile ? 'block' : mobileVisibility[breakpoint]);
	let mobileContent = $state<HTMLDivElement | null>(null);

	function handleOpenChange(nextOpen: boolean) {
		open = nextOpen;
		onOpenChange?.(nextOpen);
	}

	function closeMobileMenu() {
		handleOpenChange(false);
	}

	function handleMobileOpenAutoFocus(event: Event) {
		event.preventDefault();
		requestAnimationFrame(() => mobileContent?.focus({ preventScroll: true }));
	}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- Consumer-provided URLs cannot use app-specific resolve calls. -->
<header
	data-slot="navbar"
	class={cn('w-full border-b border-border bg-background text-foreground', className)}
	{...restProps}
>
	<div class={cn('mx-auto flex h-16 w-full items-center gap-6 px-4 sm:px-6', containerClass)}>
		<a
			href={brandHref}
			class="inline-flex min-w-0 shrink-0 items-center font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			{#if typeof brand === 'string'}
				{brand}
			{:else}
				{@render brand()}
			{/if}
		</a>

		<nav aria-label={ariaLabel} class={cn('min-w-0 flex-1 items-center gap-1', desktopClass)}>
			{#each items as item (item.href)}
				{#if item.disabled}
					<span
						class="cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/50"
						aria-disabled="true"
					>
						{item.label}
					</span>
				{:else if item.subroutes?.length}
					<Popover.Root>
						<Popover.Trigger
							class={cn(
								'group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
								item.active || item.subroutes.some((subroute) => subroute.active)
									? 'bg-accent text-accent-foreground'
									: 'text-muted-foreground'
							)}
						>
							{item.label}
							{#if item.badge}
								<span class="rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.625rem] text-primary">
									{item.badge}
								</span>
							{/if}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								class="size-3.5 transition-transform group-data-[state=open]:rotate-180"
							>
								<path d="m6 9 6 6 6-6"></path>
							</svg>
						</Popover.Trigger>

						<Popover.Content align="start" sideOffset={8} class={cn('w-80 p-2', item.popoverClass)}>
							{#if item.description}
								<div class="px-3 pt-2 pb-3">
									<p class="font-medium text-foreground">{item.label}</p>
									<p class="mt-1 text-xs leading-relaxed text-muted-foreground">
										{item.description}
									</p>
								</div>
							{/if}
							<div class={cn('grid gap-1', item.subroutesClass)}>
								{#if item.showParentLink !== false}
									<Popover.Close>
										{#snippet child({ props })}
											<a
												{...props}
												href={item.href}
												target={item.external ? '_blank' : undefined}
												rel={item.external ? 'noreferrer' : undefined}
												aria-current={item.active ? 'page' : undefined}
												class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
											>
												All {item.label}
											</a>
										{/snippet}
									</Popover.Close>
								{/if}
								{#each item.subroutes as subroute (subroute.href)}
									{#if subroute.disabled}
										<div class="cursor-not-allowed rounded-md px-3 py-2 opacity-50">
											<p class="text-sm font-medium">{subroute.label}</p>
											{#if subroute.description}
												<p class="mt-0.5 text-xs text-muted-foreground">{subroute.description}</p>
											{/if}
										</div>
									{:else}
										<Popover.Close>
											{#snippet child({ props })}
												<a
													{...props}
													href={subroute.href}
													target={subroute.external ? '_blank' : undefined}
													rel={subroute.external ? 'noreferrer' : undefined}
													aria-current={subroute.active ? 'page' : undefined}
													class={cn(
														'block rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
														subroute.active && 'bg-accent text-accent-foreground'
													)}
												>
													<span class="flex items-center gap-2 text-sm font-medium">
														{subroute.label}
														{#if subroute.badge}
															<span
																class="rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.625rem] text-primary"
															>
																{subroute.badge}
															</span>
														{/if}
													</span>
													{#if subroute.description}
														<span
															class="mt-0.5 block text-xs leading-relaxed text-muted-foreground"
														>
															{subroute.description}
														</span>
													{/if}
												</a>
											{/snippet}
										</Popover.Close>
									{/if}
								{/each}
							</div>
						</Popover.Content>
					</Popover.Root>
				{:else}
					<a
						href={item.href}
						target={item.external ? '_blank' : undefined}
						rel={item.external ? 'noreferrer' : undefined}
						aria-current={item.active ? 'page' : undefined}
						class={cn(
							'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
							item.active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
						)}
					>
						{item.label}
						{#if item.badge}
							<span class="rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.625rem] text-primary">
								{item.badge}
							</span>
						{/if}
					</a>
				{/if}
			{/each}
		</nav>

		{#if actions}
			<div class={cn('ml-auto items-center gap-2', desktopClass)}>
				{@render actions()}
			</div>
		{/if}

		<div class={cn('ml-auto', mobileClass)}>
			<Sheet.Root bind:open onOpenChange={handleOpenChange}>
				<Sheet.Trigger
					class="inline-flex size-10 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
					aria-label="Open navigation menu"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
						class="size-5"
					>
						<path d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</Sheet.Trigger>

				<Sheet.Content
					bind:ref={mobileContent}
					side={mobileSide}
					tabindex={-1}
					onOpenAutoFocus={handleMobileOpenAutoFocus}
					class={cn('w-[min(22rem,85vw)] gap-0 p-0', contentClass)}
				>
					<Sheet.Header class="border-b border-border px-6 py-5 text-left">
						<Sheet.Title>{mobileTitle}</Sheet.Title>
						<Sheet.Description>{mobileDescription}</Sheet.Description>
					</Sheet.Header>

					{#if mobileActions}
						<div class="border-b border-border p-4">
							{@render mobileActions()}
						</div>
					{/if}

					<nav
						aria-label={`${ariaLabel} mobile`}
						class="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
					>
						{#each items as item (item.href)}
							{#if item.disabled}
								<span
									class="cursor-not-allowed rounded-lg px-3 py-3 text-sm text-muted-foreground/50"
									aria-disabled="true"
								>
									<span class="font-medium">{item.label}</span>
									{#if item.description}
										<span class="mt-1 block text-xs leading-relaxed">{item.description}</span>
									{/if}
								</span>
							{:else}
								<div class="grid gap-1">
									{#if item.subroutes?.length && item.showParentLink === false}
										<div class="px-3 pt-2 pb-1">
											<span
												class="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
											>
												{item.label}
											</span>
											{#if item.mobileShowDescriptions !== false && item.description}
												<span class="mt-1 block text-xs leading-relaxed text-muted-foreground">
													{item.description}
												</span>
											{/if}
										</div>
									{:else}
										<a
											href={item.href}
											target={item.external ? '_blank' : undefined}
											rel={item.external ? 'noreferrer' : undefined}
											aria-current={item.active ? 'page' : undefined}
											onclick={closeMobileMenu}
											class={cn(
												'rounded-lg px-3 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
												item.active ? 'bg-accent text-accent-foreground' : 'text-foreground'
											)}
										>
											<span class="flex items-center gap-2 font-medium">
												{item.label}
												{#if item.badge}
													<span
														class="rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.625rem] text-primary"
													>
														{item.badge}
													</span>
												{/if}
											</span>
											{#if item.mobileShowDescriptions !== false && item.description}
												<span class="mt-1 block text-xs leading-relaxed text-muted-foreground">
													{item.description}
												</span>
											{/if}
										</a>
									{/if}

									{#if item.subroutes?.length}
										<div
											class={cn(
												'grid gap-1',
												item.showParentLink !== false && 'ml-3 border-l border-border pl-3'
											)}
										>
											{#each item.subroutes as subroute (subroute.href)}
												{#if subroute.disabled}
													<span
														class="cursor-not-allowed rounded-md px-3 py-2 text-sm text-muted-foreground/50"
													>
														{subroute.label}
													</span>
												{:else}
													<a
														href={subroute.href}
														target={subroute.external ? '_blank' : undefined}
														rel={subroute.external ? 'noreferrer' : undefined}
														aria-current={subroute.active ? 'page' : undefined}
														onclick={closeMobileMenu}
														class={cn(
															'rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
															subroute.active
																? 'bg-accent text-accent-foreground'
																: 'text-muted-foreground'
														)}
													>
														<span class="flex items-center gap-2 font-medium">
															{subroute.label}
															{#if subroute.badge}
																<span
																	class="rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.625rem] text-primary"
																>
																	{subroute.badge}
																</span>
															{/if}
														</span>
														{#if item.mobileShowDescriptions !== false && subroute.description}
															<span
																class="mt-1 block text-xs leading-relaxed text-muted-foreground"
															>
																{subroute.description}
															</span>
														{/if}
													</a>
												{/if}
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						{/each}
					</nav>

					{#if mobileFooter}
						<div class="mt-auto border-t border-border p-4">
							{@render mobileFooter()}
						</div>
					{/if}
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>
