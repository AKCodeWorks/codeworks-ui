<script lang="ts">
	import { Install, type InstallValue } from '$lib/components/ui/install';

	const values: InstallValue[] = [
		{ value: 'npm', command: 'npm install' },
		{ value: 'pnpm', command: 'pnpm add' },
		{ value: 'yarn', command: 'yarn add' },
		{ value: 'bun', command: 'bun add' }
	];
</script>

<Install {values} script="bits-ui" class="w-full max-w-xl" />
