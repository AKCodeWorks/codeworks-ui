import { error } from '@sveltejs/kit';
import { components, hasComponent } from '$lib/docs/component-metadata';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	if (!hasComponent(params.component)) error(404, 'Component not found');
	return { slug: params.component };
};

export const entries = () => components.map((component) => ({ component: component.name }));
