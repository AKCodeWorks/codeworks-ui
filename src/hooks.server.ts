import type { Handle } from '@sveltejs/kit';
import { assertPlaygroundEnabled } from './routes/playground/playground.server';

export const handle: Handle = async ({ event, resolve }) => {
	const isPlaygroundRoute =
		event.url.pathname === '/playground' || event.url.pathname.startsWith('/playground/');

	if (isPlaygroundRoute) {
		assertPlaygroundEnabled();
	}

	return resolve(event);
};
