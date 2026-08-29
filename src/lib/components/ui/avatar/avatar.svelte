<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cw } from '$lib/utils/cw';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.RootProps = $props();
</script>

<AvatarPrimitive.Root
	bind:ref
	data-slot="avatar"
	class={cw('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
	{...restProps}
/>
