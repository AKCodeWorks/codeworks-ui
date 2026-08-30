import type { LayoutServerLoad } from './$types';
import { assertPlaygroundEnabled } from './playground.server';

export const load: LayoutServerLoad = () => {
	assertPlaygroundEnabled();
};
