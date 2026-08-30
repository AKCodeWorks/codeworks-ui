<script lang="ts">
	import { Error as ErrorPage } from '$lib/components/ui/error';
</script>

{#snippet children()}
	<div class="mx-auto max-w-md text-sm text-muted-foreground">
		<p>Reference: req_7f8a21</p>
		<details class="mt-3 rounded-lg border border-border bg-background p-3 text-left">
			<summary class="cursor-pointer font-medium text-foreground">Technical details</summary>
			<p class="mt-2 font-mono text-xs">The upstream service did not respond before timeout.</p>
		</details>
	</div>
{/snippet}

<ErrorPage
	status={504}
	error={{ message: 'Your request is safe, but the service took too long to answer.' }}
	{children}
	class="min-h-[32rem]"
/>
