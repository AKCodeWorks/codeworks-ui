<script lang="ts">
	import { page } from '$app/state';
	import { Code } from '$lib/components/ui/code';

	const output = [
		'✓ 42 modules transformed',
		'✓ rendered documentation pages',
		'✓ registry items generated',
		'',
		'Build completed in 1.8s'
	].join('\n');

	const longCommand = $derived(
		`pnpm dlx shadcn-svelte@latest add ${page.url.origin}/r/holographic.json --overwrite`
	);
</script>

<div class="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
	<Code code={output} language="text" label="Build output" showCopy={false} class="sm:max-w-sm" />
	<Code code={longCommand} language="shellscript" label="One-line command" class="sm:max-w-sm" />
</div>
