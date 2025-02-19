import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

const defaultValue = 'system';
const initialValue = browser ? window.localStorage.getItem('theme') ?? defaultValue : defaultValue;

const theme = writable(initialValue);

theme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('theme', value);
	}
});

// Derived store for Carbon theme
export const carbonTheme = derived(theme, ($theme) => {
	if ($theme === 'dark') return 'g90';
	if ($theme === 'light') return 'white';
	return 'g90'; // Default to 'g90' for system or other values
});

export default theme

