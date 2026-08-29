import type { Component } from 'svelte';
import registry from '../../../registry.json';
import type { ApiProperty, ComponentDoc } from './types';

type RegistryItem = {
	name: string;
	type: string;
	title?: string;
	description?: string;
	files?: Array<{ path: string; type: string }>;
	meta?: { docs?: { usage?: string; api?: ApiProperty[] } };
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
		const demoPath = `./demos/${item.name}.svelte`;
		const demo = demoModules[demoPath]?.default;
		if (!demo) throw new Error(`Missing documentation demo: ${demoPath}`);
		const installScript = `shadcn-svelte@latest add https://ui.akcodeworks.com/r/${item.name}.json`;

		return {
			name: item.name,
			title: item.title ?? item.name,
			description: item.description ?? '',
			usage: item.meta?.docs?.usage ?? '',
			api: item.meta?.docs?.api ?? [],
			demo,
			demoSource: demoSources[demoPath] ?? '',
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
			],
			installScript
		};
	})
	.sort((a, b) => a.title.localeCompare(b.title));

export function getComponent(name: string) {
	return components.find((component) => component.name === name);
}
