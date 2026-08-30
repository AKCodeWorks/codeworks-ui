<script lang="ts">
	import { Error as ErrorPage } from '$lib/components/ui/error';
</script>

<ErrorPage
	status={403}
	error={{ message: 'Ask a workspace administrator if you believe you should have access.' }}
	homeHref={null}
	showRetry={false}
	class="min-h-[32rem]"
/>
