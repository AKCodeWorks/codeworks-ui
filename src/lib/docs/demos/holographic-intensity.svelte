<script lang="ts">
	import { Holographic } from '$lib/components/ui/holographic';

	const treatments = [
		{ label: 'Whisper', intensity: 0.06, duration: 8000 },
		{ label: 'Balanced', intensity: 0.16, duration: 5000 },
		{ label: 'Vivid', intensity: 0.3, duration: 2800 }
	];
</script>

<div class="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
	{#each treatments as treatment (treatment.label)}
		<Holographic
			intensity={treatment.intensity}
			duration={treatment.duration}
			class="rounded-xl shadow-lg"
		>
			<div class="bg-zinc-950 p-5 text-white">
				<p class="font-semibold">{treatment.label}</p>
				<p class="mt-1 text-xs text-white/60">
					{Math.round(treatment.intensity * 100)}% · {treatment.duration / 1000}s
				</p>
			</div>
		</Holographic>
	{/each}
</div>
