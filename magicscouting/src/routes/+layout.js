export const prerender = true;
export const ssr = true;

// +layout.ts
import { browser } from '$app/environment';
import '$lib/i18n'; // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n';

/** @type {import('./$types').LayoutLoad} */
export async function load() {
	if (browser) {
		console.log('wdadw');
		locale.set(window.navigator.language);
	}
	await waitLocale();
}
