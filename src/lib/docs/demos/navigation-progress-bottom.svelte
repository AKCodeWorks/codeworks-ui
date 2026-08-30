<script lang="ts">
	import { NavigationProgress } from '$lib/components/ui/navigation-progress';
</script>

<div
	class="relative grid min-h-56 w-full max-w-xl place-items-center overflow-hidden rounded-xl border border-border bg-background p-6 text-center"
>
	<NavigationProgress position="bottom" contained trackNavigation={false} value={78} />
	<div>
		<p class="font-medium">Bottom placement</p>
		<p class="mt-1 text-sm text-muted-foreground">
			Contained mode makes placement easy to preview inside panels and application shells.
		</p>
	</div>
</div>
