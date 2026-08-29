<script lang="ts">
	import { Install, type InstallValue } from '$lib/components/ui/install';

	const values: InstallValue[] = [
		{ value: 'npm', command: 'npm install', label: 'npm' },
		{ value: 'pnpm', command: 'pnpm add', label: 'pnpm' },
		{ value: 'yarn', command: 'yarn add', label: 'Yarn Classic', disabled: true }
	];
</script>

<div class="w-full max-w-xl space-y-3">
	<p class="text-sm text-muted-foreground">
		This workspace disables Yarn Classic while keeping the unavailable option visible.
	</p>
	<Install {values} script="@acme/design-system" storageKey="docs:workspace-manager" />
</div>
