/** @type {import('@sveltejs/kit').Handle} */
import { locale } from 'svelte-i18n';

// @ts-ignore
export const Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0];
	if (lang) {
		locale.set(lang);
	}
	return resolve(event);
};
