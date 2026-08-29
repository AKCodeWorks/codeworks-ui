<script lang="ts">
	import { Code } from '$lib/components/ui/code';

	const typescript = [
		'type User = {',
		'  id: string;',
		'  name: string;',
		'};',
		'',
		'const user: User = { id: "usr_01", name: "Maya" };'
	].join('\n');

	const json = JSON.stringify(
		{
			name: 'codeworks-ui',
			private: true,
			scripts: { check: 'svelte-kit sync && svelte-check' }
		},
		null,
		2
	);

	const shell = ['pnpm install', 'pnpm run check', 'pnpm run build'].join('\n');
</script>

<div class="grid w-full max-w-3xl gap-4 lg:grid-cols-2">
	<Code code={typescript} language="typescript" label="user.ts" />
	<Code code={json} language="json" label="package.json" />
	<Code code={shell} language="shellscript" label="Terminal" class="lg:col-span-2" />
</div>
