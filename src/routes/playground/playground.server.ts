import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export function assertPlaygroundEnabled() {
	if (env.NODE_ENV === 'production') {
		error(404, 'Not found');
	}
}
