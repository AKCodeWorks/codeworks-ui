<script lang="ts">
	import { page } from '$app/state';
	import { Install, type InstallValue } from '$lib/components/ui/install';

	const values: InstallValue[] = [
		{ value: 'npm', command: 'npx' },
		{ value: 'pnpm', command: 'pnpm dlx' },
		{ value: 'yarn', command: 'yarn dlx' },
		{ value: 'bun', command: 'bun x' }
	];

	const script = $derived(`shadcn-svelte@latest add ${page.url.origin}/r/aura.json`);
</script>

<Install {values} {script} storageKey="docs:cli-runner" class="w-full max-w-2xl" />
