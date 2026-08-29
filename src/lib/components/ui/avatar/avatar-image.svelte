<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cw } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.ImageProps = $props();
</script>

<AvatarPrimitive.Image
	bind:ref
	data-slot="avatar-image"
	class={cw('aspect-square size-full object-cover', className)}
	{...restProps}
/>
