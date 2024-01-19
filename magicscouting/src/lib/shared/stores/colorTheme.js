import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';

const defaultValue = 'blue';
const initialValue = browser
	? window.localStorage.getItem('colorTheme') ?? defaultValue
	: defaultValue;

const colorTheme = writable(initialValue);

colorTheme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('colorTheme', value);
	}
});

export const currentTheme100 = derived(colorTheme, ($colorTheme, set) => {set('bg-' + $colorTheme + 'Theme-' + '100')}, defaultValue);
export const currentTheme200 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '200')}, defaultValue);
export const currentTheme300 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '300')}, defaultValue);
export const currentTheme400 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '400')}, defaultValue);
export const currentTheme500 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '500')}, defaultValue);
export const currentTheme600 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '600')}, defaultValue);
export const currentTheme700 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '700')}, defaultValue);
export const currentTheme800 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '800')}, defaultValue);
export const currentTheme900 = derived(colorTheme, ($colorTheme, set) => {set('bg-'+$colorTheme + 'Theme-' + '900')}, defaultValue);


export default colorTheme;
