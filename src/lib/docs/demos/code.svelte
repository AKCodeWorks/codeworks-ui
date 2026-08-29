<script lang="ts">
	import { Code } from '$lib/components/ui/code';

	const example = [
		'<script lang="ts">',
		'  let count = $state(0);',
		'<' + '/script>',
		'',
		'<button onclick={() => count++}>',
		'  Clicked {count} times',
		'</button>'
	].join('\n');
</script>

<Code code={example} language="svelte" label="Counter.svelte" class="w-full max-w-xl" />
