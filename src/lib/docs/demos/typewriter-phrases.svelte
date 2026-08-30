<script lang="ts">
	import { Typewriter } from '$lib/components/ui/typewriter';

	const phrases = ['Fast to compose.', 'Easy to customize.', 'Built for Svelte.'];
</script>

<p class="text-center text-2xl font-semibold sm:text-3xl">
	<Typewriter value={phrases} loop class="text-primary" cursorClass="text-muted-foreground" />
</p>
