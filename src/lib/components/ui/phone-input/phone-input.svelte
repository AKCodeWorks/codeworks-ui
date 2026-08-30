<script module lang="ts">
	import parsePhoneNumber from 'libphonenumber-js';
	import type { CountryCode } from 'libphonenumber-js';

	export const PHONE_COUNTRIES = {
		UNITED_STATES: 'US',
		CANADA: 'CA',
		MEXICO: 'MX',
		BRAZIL: 'BR',
		ARGENTINA: 'AR',
		CHILE: 'CL',
		COLOMBIA: 'CO',
		PERU: 'PE',
		COSTA_RICA: 'CR',
		PANAMA: 'PA',
		DOMINICAN_REPUBLIC: 'DO',
		UNITED_KINGDOM: 'GB',
		IRELAND: 'IE',
		FRANCE: 'FR',
		GERMANY: 'DE',
		SPAIN: 'ES',
		PORTUGAL: 'PT',
		ITALY: 'IT',
		NETHERLANDS: 'NL',
		BELGIUM: 'BE',
		SWITZERLAND: 'CH',
		AUSTRIA: 'AT',
		SWEDEN: 'SE',
		NORWAY: 'NO',
		DENMARK: 'DK',
		FINLAND: 'FI',
		POLAND: 'PL',
		CZECH_REPUBLIC: 'CZ',
		ROMANIA: 'RO',
		GREECE: 'GR',
		UKRAINE: 'UA',
		TURKEY: 'TR',
		RUSSIA: 'RU',
		INDIA: 'IN',
		PAKISTAN: 'PK',
		BANGLADESH: 'BD',
		SRI_LANKA: 'LK',
		CHINA: 'CN',
		TAIWAN: 'TW',
		HONG_KONG: 'HK',
		JAPAN: 'JP',
		SOUTH_KOREA: 'KR',
		SINGAPORE: 'SG',
		MALAYSIA: 'MY',
		INDONESIA: 'ID',
		PHILIPPINES: 'PH',
		THAILAND: 'TH',
		VIETNAM: 'VN',
		AUSTRALIA: 'AU',
		NEW_ZEALAND: 'NZ',
		UNITED_ARAB_EMIRATES: 'AE',
		SAUDI_ARABIA: 'SA',
		QATAR: 'QA',
		KUWAIT: 'KW',
		ISRAEL: 'IL',
		SOUTH_AFRICA: 'ZA',
		NIGERIA: 'NG',
		KENYA: 'KE',
		EGYPT: 'EG',
		MOROCCO: 'MA',
		GHANA: 'GH',
		TANZANIA: 'TZ',
		UGANDA: 'UG'
	} as const satisfies Record<string, CountryCode>;

	type CommonPhoneCountry = keyof typeof PHONE_COUNTRIES;
	export type PhoneCountry = CommonPhoneCountry | CountryCode;

	export const E164_PHONE_PATTERN = /^\+[1-9][0-9]{1,14}$/;

	function resolveCountry(country: PhoneCountry): CountryCode {
		return country in PHONE_COUNTRIES
			? PHONE_COUNTRIES[country as CommonPhoneCountry]
			: (country as CountryCode);
	}

	export function isE164PhoneNumber(value: string, countries: readonly PhoneCountry[] = []) {
		if (!E164_PHONE_PATTERN.test(value)) return false;

		const phoneNumber = parsePhoneNumber(value, { extract: false });
		if (!phoneNumber?.isValid()) return false;
		if (countries.length === 0) return true;

		return (
			phoneNumber.country !== undefined &&
			countries.some((country) => resolveCountry(country) === phoneNumber.country)
		);
	}
</script>

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils.js';

	type PhoneInputProps = Omit<
		HTMLInputAttributes,
		| 'type'
		| 'value'
		| 'files'
		| 'pattern'
		| 'maxlength'
		| 'inputmode'
		| 'aria-invalid'
		| 'aria-describedby'
		| 'oninput'
		| 'onblur'
	> & {
		value?: string;
		valid?: boolean;
		countries?: readonly PhoneCountry[];
		error?: string;
		onValueChange?: (value: string, valid: boolean) => void;
		class?: string;
		inputClass?: string;
	};

	let {
		value = $bindable(''),
		countries = [],
		valid = $bindable(isE164PhoneNumber(value, countries)),
		error = 'Enter a valid phone number, such as +15404441234.',
		onValueChange,
		class: className,
		inputClass,
		id,
		'aria-label': ariaLabel = 'Phone number',
		required = false,
		disabled = false,
		placeholder = '+15404441234',
		...restProps
	}: PhoneInputProps = $props();

	const generatedId = $props.id();
	const inputId = $derived(id ?? `${generatedId}-phone`);
	const errorId = $derived(`${inputId}-error`);
	const valueIsValid = $derived(isE164PhoneNumber(value, countries));
	const showError = $derived(Boolean(error) && value !== '' && !valueIsValid);

	function handleInput(event: Event) {
		value = (event.currentTarget as HTMLInputElement).value;
		valid = isE164PhoneNumber(value, countries);
		(event.currentTarget as HTMLInputElement).setCustomValidity(
			valid ? '' : error || 'Invalid phone number.'
		);
		onValueChange?.(value, valid);
	}
</script>

<div data-slot="phone-input" class={cn('grid gap-2', className)}>
	<Input
		{...restProps}
		id={inputId}
		type="tel"
		inputmode="tel"
		autocomplete="tel"
		pattern={E164_PHONE_PATTERN.source}
		maxlength={16}
		{required}
		{disabled}
		{placeholder}
		{value}
		aria-label={ariaLabel}
		aria-invalid={showError}
		aria-describedby={showError ? errorId : undefined}
		oninput={handleInput}
		class={cn('h-10 font-mono placeholder:font-sans', inputClass)}
	/>
	{#if showError}
		<p id={errorId} class="text-xs text-destructive">{error}</p>
	{/if}
</div>
