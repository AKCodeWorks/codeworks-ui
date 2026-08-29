<script lang="ts" module>
	import { cw } from '$lib/utils/cw';

	export type ButtonVariant =
		'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

	export const buttonVariants = ({
		variant = 'default',
		size = 'default',
		class: className
	}: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: import('clsx').ClassValue;
	} = {}) =>
		cw(
			'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
			{
				'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90': variant === 'default',
				'bg-destructive text-white shadow-sm hover:bg-destructive/90': variant === 'destructive',
				'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground':
					variant === 'outline',
				'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80':
					variant === 'secondary',
				'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
				'text-primary underline-offset-4 hover:underline': variant === 'link',
				'h-10 px-4 py-2': size === 'default',
				'h-9 rounded-md px-3': size === 'sm',
				'h-11 rounded-md px-8': size === 'lg',
				'size-10': size === 'icon'
			},
			className
		);
</script>

<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		size = 'default',
		...restProps
	}: ButtonPrimitive.RootProps & { variant?: ButtonVariant; size?: ButtonSize } = $props();
</script>

<ButtonPrimitive.Root
	bind:ref
	data-slot="button"
	class={buttonVariants({ variant, size, class: className })}
	{...restProps}
/>
