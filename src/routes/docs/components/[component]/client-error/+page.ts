import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	if (params.component !== 'error') error(404, 'Component not found');

	if (browser) {
		throw new Error('This client error was thrown intentionally from the Error component docs.');
	}
};
