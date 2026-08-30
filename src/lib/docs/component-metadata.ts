import registry from '../../../registry.json';

type RegistryItem = {
	name: string;
	type: string;
	title?: string;
	description?: string;
};

export type ComponentMetadata = {
	name: string;
	title: string;
	description: string;
};

export const components: ComponentMetadata[] = (registry.items as RegistryItem[])
	.filter((item) => item.type === 'registry:ui')
	.map((item) => ({
		name: item.name,
		title: item.title ?? item.name,
		description: item.description ?? ''
	}))
	.sort((a, b) => a.title.localeCompare(b.title));

export function hasComponent(name: string) {
	return components.some((component) => component.name === name);
}
