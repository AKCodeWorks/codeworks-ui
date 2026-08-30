import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({
	showPlayground: env.NODE_ENV === 'development'
});
