<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PhoneInput } from '$lib/components/ui/phone-input';

	let phone = $state('');
	let valid = $state(false);
	let result = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!valid) {
			result = 'Enter a complete U.S. phone number.';
			(event.currentTarget as HTMLFormElement).reportValidity();
			return;
		}

		result = `${phone} is ready for messaging.`;
	}
</script>

<form class="w-full max-w-sm space-y-3" onsubmit={submit}>
	<PhoneInput bind:value={phone} bind:valid name="phone" countries={['UNITED_STATES']} required />
	<div class="flex items-center gap-3">
		<Button type="submit">Validate number</Button>
		{#if result}<p class="text-xs text-muted-foreground" aria-live="polite">{result}</p>{/if}
	</div>
</form>
