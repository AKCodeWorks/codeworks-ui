<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PhoneInput } from '$lib/components/ui/phone-input';

	let phone = $state('');
	let valid = $state(false);
	let result = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		result = valid ? `Accepted destination: ${phone}` : 'Enter a number from an accepted country.';
		if (!valid) (event.currentTarget as HTMLFormElement).reportValidity();
	}
</script>

<form class="w-full max-w-sm space-y-3" onsubmit={submit}>
	<PhoneInput
		bind:value={phone}
		bind:valid
		name="phone"
		countries={['UNITED_STATES', 'CANADA', 'UNITED_KINGDOM']}
		placeholder="+442071838750"
		error="Enter a valid U.S., Canadian, or U.K. phone number."
		required
	/>
	<div class="flex items-center gap-3">
		<Button type="submit">Check destination</Button>
		{#if result}<p class="text-xs text-muted-foreground" aria-live="polite">{result}</p>{/if}
	</div>
</form>
