<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';

	function runDemo() {
		void goto(resolve('/docs/components/[component]', { component: 'navigation-progress' }), {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
			state: { progressDemo: Date.now() }
		});
	}
</script>

<div class="grid max-w-md gap-4 text-center">
	<div>
		<p class="font-medium">The documentation layout is tracking navigation</p>
		<p class="mt-1 text-sm leading-6 text-muted-foreground">
			Run a same-page navigation to see the site-level bar use the real SvelteKit navigation
			lifecycle without leaving these docs.
		</p>
	</div>
	<div><Button onclick={runDemo}>Run progress demo</Button></div>
</div>
