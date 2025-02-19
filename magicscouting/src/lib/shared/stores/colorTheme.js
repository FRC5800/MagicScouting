import { browser } from '$app/environment';
import { writable } from 'svelte/store';

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

export default colorTheme;
