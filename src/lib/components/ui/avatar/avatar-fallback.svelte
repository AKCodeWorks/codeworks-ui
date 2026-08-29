<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cw } from '$lib/utils/cw';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	data-slot="avatar-fallback"
	class={cw(
		'flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium',
		className
	)}
	{...restProps}
/>
