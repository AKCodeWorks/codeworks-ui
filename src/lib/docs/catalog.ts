import type { Component } from 'svelte';
import registry from '../../../registry.json';
import type { ApiProperty, ComponentDoc, ComponentExample } from './types';

type RegistryExample = {
	name: string;
	title: string;
	description?: string;
};

type RegistryApiProperty = Omit<ApiProperty, 'description'> & { description?: string };

type RegistryItem = {
	name: string;
	type: string;
	title?: string;
	description?: string;
	files?: Array<{ path: string; type: string }>;
	meta?: {
		docs?: {
			demo?: string;
			usage?: string | string[];
			api?: RegistryApiProperty[];
			moreExamples?: RegistryExample[];
		};
	};
};

const demoModules = import.meta.glob('./demos/*.svelte', { eager: true }) as Record<
	string,
	{ default: Component }
>;
const demoSources = import.meta.glob('./demos/*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;
const componentSources = import.meta.glob('/src/lib/components/ui/**/*.{svelte,ts}', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;
const items = registry.items as RegistryItem[];

export const components: ComponentDoc[] = items
	.filter((item) => item.type === 'registry:ui')
	.map((item) => {
		const demoName = item.meta?.docs?.demo ?? item.name;
		const demoPath = `./demos/${demoName}.svelte`;
		const demo = demoModules[demoPath]?.default;
		if (!demo) throw new Error(`Missing documentation demo: ${demoPath}`);
		const moreExamples = (item.meta?.docs?.moreExamples ?? []).map((example) => {
			const examplePath = `./demos/${item.name}-${example.name}.svelte`;
			const exampleDemo = demoModules[examplePath]?.default;
			if (!exampleDemo) throw new Error(`Missing documentation demo: ${examplePath}`);

			return {
				...example,
				demo: exampleDemo,
				demoSource: demoSources[examplePath] ?? ''
			} satisfies ComponentExample;
		});

		const usage = item.meta?.docs?.usage ?? '';

		return {
			name: item.name,
			title: item.title ?? item.name,
			description: item.description ?? '',
			usage: Array.isArray(usage) ? usage : [usage],
			api: (item.meta?.docs?.api ?? []).map((property) => ({
				...property,
				description:
					property.description ?? describeApiProperty(item.title ?? item.name, property.name)
			})),
			demo,
			demoSource: demoSources[demoPath] ?? '',
			moreExamples,
			sources: (item.files ?? []).map((file) => ({
				name: file.path.split('/').at(-1) ?? file.path,
				code: componentSources[`/${file.path}`] ?? ''
			})),
			installValues: [
				{
					value: 'npm',
					command: 'npx'
				},
				{
					value: 'pnpm',
					command: 'pnpm dlx'
				},
				{
					value: 'yarn',
					command: 'yarn dlx'
				},
				{
					value: 'bun',
					command: 'bun x'
				}
			]
		};
	})
	.sort((a, b) => a.title.localeCompare(b.title));

export function getComponent(name: string) {
	return components.find((component) => component.name === name);
}

function getApiDescription(name: string) {
	const descriptions: Record<string, string> = {
		class: 'Tailwind CSS classes applied to the component root.',
		children: 'Content rendered inside the component.',
		value: 'The current controlled value.',
		values: 'Available values rendered by the component.',
		open: 'Controls whether the interactive surface is open.',
		disabled: 'Prevents interaction when enabled.',
		required: 'Marks the underlying form control as required.',
		variant: 'Selects the visual treatment.',
		size: 'Selects the component size.',
		color: 'Overrides the primary CSS color.',
		colors: 'Colors used by the visual effect.',
		backgroundColor: 'Background CSS color rendered behind the effect.',
		duration: 'Duration of the animation in milliseconds.',
		code: 'Source text displayed by the code block.',
		language: 'Language used for syntax highlighting.',
		label: 'Visible or accessible label for the control.',
		showCopy: 'Shows the copy-to-clipboard action when enabled.',
		status: 'HTTP status code used to select the error presentation.',
		error: 'SvelteKit error object whose message is displayed.',
		title: 'Overrides the generated heading.',
		message: 'Overrides the displayed supporting message.',
		homeHref: 'Destination of the home recovery action.',
		homeLabel: 'Label displayed by the home recovery action.',
		showRetry: 'Shows the retry recovery action when enabled.',
		retryLabel: 'Label displayed by the retry action.',
		onRetry: 'Called when the retry action is selected.',
		files: 'Current selected files; bind this prop to manage the list externally.',
		onFilesChange: 'Called whenever files are added, renamed, or removed.',
		onUpload: 'Async upload callback that receives the selected files and upload context.',
		onUploadComplete: 'Called after an upload finishes successfully.',
		onUploadError: 'Called when the upload callback throws or rejects.',
		onReject: 'Called with files rejected by type, count, or size validation.',
		autoUpload: 'Starts the upload callback immediately after valid files are added.',
		name: 'Name used by the native form file input.',
		accept: 'Accepted MIME types or file extensions.',
		multiple: 'Allows more than one file to be selected.',
		maxFiles: 'Maximum number of files allowed in the list.',
		maxFileSize: 'Maximum allowed size of each file in bytes.',
		dropLabel: 'Instruction shown in the drop target.',
		browseLabel: 'Label displayed by the file picker action.',
		inputProps: 'Additional attributes forwarded to the native file input.',
		script: 'Shared command text appended to each package-manager runner.',
		storageKey: 'Browser storage key used to remember the selected value.',
		intensity: 'Strength of the visual effect.',
		position: 'Edge where the progress indicator is displayed.',
		maxProgress: 'Highest progress value reached while navigation is still pending.',
		initialProgress: 'Progress value shown when navigation begins.',
		trickleInterval: 'Delay between automatic progress increments in milliseconds.',
		transitionDuration: 'Duration of progress and opacity transitions in milliseconds.',
		completionDelay: 'Delay before hiding the completed bar in milliseconds.',
		height: 'Thickness of the progress bar in pixels.',
		zIndex: 'CSS stacking level of the progress bar.',
		contained: 'Positions the bar inside its nearest positioned ancestor instead of the viewport.',
		ariaLabel: 'Accessible label announced for the progress indicator.',
		onStart: 'Called when tracked navigation begins.',
		onComplete: 'Called when the progress bar reaches completion.',
		items: 'Items available for selection or rendering.',
		onValueChange: 'Called whenever the controlled value changes.',
		onMention: 'Called whenever a mention is selected.',
		onSearch: 'Called with the active query for asynchronous suggestion loading.',
		filter: 'Custom function used to filter suggestion items.',
		formatMention: 'Formats the text inserted for a selected mention.',
		triggers: 'Characters that can begin a mention query.',
		minQueryLength: 'Minimum query length required before suggestions appear.',
		maxSuggestions: 'Maximum number of suggestions displayed.',
		allowSpaces: 'Allows spaces inside an active mention query.',
		suggestion: 'Snippet used to render each suggestion.',
		empty: 'Snippet shown when no suggestions match.',
		brand: 'Snippet rendered as the navigation brand.',
		brandHref: 'Destination used when the brand is selected.',
		breakpoint: 'Viewport width where desktop navigation replaces the mobile menu.',
		forceMobile: 'Uses the mobile navigation presentation at every viewport size.',
		mobileSide: 'Side from which the mobile navigation sheet opens.',
		onOpenChange: 'Called whenever the mobile navigation open state changes.',
		actions: 'Snippet rendered as desktop navigation actions.',
		mobileActions: 'Snippet rendered as actions inside mobile navigation.',
		mobileFooter: 'Snippet rendered at the bottom of mobile navigation.',
		valid: 'Whether the current value passes validation.',
		countries: 'Countries whose phone-number formats are accepted.',
		content: 'Content displayed inside the floating surface.',
		side: 'Preferred side of the trigger where content appears.',
		align: 'Alignment of floating content relative to its trigger.',
		sideOffset: 'Distance in pixels between the trigger and floating content.',
		delayDuration: 'Delay before the floating content opens in milliseconds.',
		tapToOpen: 'Allows touch users to open the tooltip with a tap.',
		showArrow: 'Shows the arrow pointing toward the trigger.'
	};

	return descriptions[name];
}

function getScopedApiDescription(name: string) {
	const descriptions: Record<string, string> = {
		'Message.side': 'Aligns the message with the sender or recipient side of the conversation.',
		'Composer.value': 'Current text in the message composer.',
		'Composer.onSend': 'Called with the composed message when it is submitted.',
		'Composer.clearOnSend': 'Clears the composer after a successful submission.',
		'Composer.submitOnEnter': 'Submits on Enter while preserving Shift+Enter for a new line.',
		'Composer.disabled': 'Prevents typing and submission when enabled.',
		'Root.open': 'Controls whether the root menu is open.',
		Trigger: 'Element that opens the component through its supported interaction.',
		Content: 'Floating surface that contains the component content.',
		'Item.variant': 'Selects the visual treatment for an individual item.',
		'Item.inset': 'Adds leading inset spacing to align an item with icon-bearing actions.',
		'CheckboxItem.checked': 'Controls whether the checkbox item is selected.',
		'RadioGroup.value': 'Value of the currently selected radio item.',
		'Sub.open': 'Controls whether the nested submenu is open.',
		'FileUploadContext.onProgress': 'Reports upload progress for one file or the entire batch.',
		'FileUploadContext.signal': 'Abort signal used to cancel in-flight upload work.',
		'MentionItem.onMention': 'Called when this specific mention item is selected.',
		'NavbarItem.subroutes': 'Nested navigation destinations associated with an item.',
		'NavbarItem.showParentLink': 'Includes the parent destination alongside its nested routes.',
		'NavbarItem.popoverClass': 'Tailwind CSS classes applied to the desktop subroute popover.',
		'NavbarItem.subroutesClass': 'Tailwind CSS classes applied to the subroute list.',
		'NavbarItem.mobileShowDescriptions': 'Shows subroute descriptions in the mobile navigation.',
		'Root.direction': 'Sets the horizontal or vertical layout direction.',
		'Item.state': 'Sets the semantic state of an individual item.',
		'Item.indicator': 'Custom snippet rendered as the item indicator.',
		'Item.indicatorClass': 'Tailwind CSS classes applied to the item indicator.',
		'Item.labelClass': 'Tailwind CSS classes applied to the item label.'
	};

	return descriptions[name];
}

function describeApiProperty(component: string, name: string) {
	const description = getScopedApiDescription(name) ?? getApiDescription(name);
	if (description) return description;

	if (name.endsWith('Class')) {
		return `Tailwind CSS classes applied to the ${humanize(name.slice(0, -5))}.`;
	}

	if (name.startsWith('on')) {
		return `Called when ${humanize(name.slice(2))} occurs.`;
	}

	return `Configures ${humanize(name)} for ${component}.`;
}

function humanize(value: string) {
	return value
		.replaceAll('.', ' ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.toLowerCase();
}
