<script lang="ts">
	import { Error as ErrorPage } from '$lib/components/ui/error';
</script>

<ErrorPage
	status={404}
	error={{ message: 'The page you requested may have moved, changed its name, or never existed.' }}
	class="min-h-[32rem]"
/>
