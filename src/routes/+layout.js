export const prerender = true;
export const ssr = true;

import '$lib/i18n'; // Import to initialize. Important :)

// /** @type {import('./$types').LayoutLoad} */
// export async function load() {
// 	if (browser) {
// 		console.log('wdadw');
// 		locale.set(window.navigator.language);
// 	}
// 	await waitLocale();
// }
