<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { PhoneInput } from '$lib/components/ui/phone-input';

	let phone = $state('');
	let valid = $state(false);
	let lookupStatus = $state('');
	let lookupTimer: ReturnType<typeof setTimeout>;

	function scheduleDeliveryLookup(value: string, valid: boolean) {
		clearTimeout(lookupTimer);
		lookupStatus = valid ? 'Checking SMS delivery support…' : '';

		if (valid) {
			lookupTimer = setTimeout(() => {
				lookupStatus = `Delivery lookup complete for ${value}`;
			}, 600);
		}
	}

	onDestroy(() => clearTimeout(lookupTimer));

	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!valid) (event.currentTarget as HTMLFormElement).reportValidity();
	}
</script>

<form class="w-full max-w-sm space-y-3" onsubmit={submit}>
	<PhoneInput
		bind:value={phone}
		bind:valid
		name="phone"
		countries={['UNITED_STATES']}
		onValueChange={scheduleDeliveryLookup}
		required
	/>
	<div class="flex items-center gap-3">
		<Button type="submit" disabled={!valid}>Continue</Button>
		{#if lookupStatus}
			<p class="text-xs text-muted-foreground" aria-live="polite">{lookupStatus}</p>
		{/if}
	</div>
</form>
