import { error } from '@sveltejs/kit';
import { components, getComponent } from '$lib/docs/catalog';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	if (!getComponent(params.component)) error(404, 'Component not found');
	return { slug: params.component };
};

export const entries = () => components.map((component) => ({ component: component.name }));
