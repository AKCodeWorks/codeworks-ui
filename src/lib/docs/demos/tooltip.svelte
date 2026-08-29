<script lang="ts">
	import { Tooltip } from '$lib/components/ui/tooltip';
</script>

<Tooltip content="Hello! This works with hover, keyboard focus, and touch." class="rounded-lg">
	<button
		class="min-h-11 rounded-lg border border-border bg-muted px-6 py-3 text-lg font-semibold shadow-sm"
	>
		Hover or tap me
	</button>
</Tooltip>
