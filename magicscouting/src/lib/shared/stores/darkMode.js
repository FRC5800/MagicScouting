import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = 'system';
const initialValue = browser ? window.localStorage.getItem('theme') ?? defaultValue : defaultValue;

const theme = writable(initialValue);

theme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('theme', value);
	}
});

export default theme;
