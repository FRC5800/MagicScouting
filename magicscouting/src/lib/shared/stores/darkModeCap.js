import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { Preferences } from '@capacitor/preferences';

const defaultValue = 'dark';
const initialValue = browser ? Preferences.get({ key: 'theme' }) ?? defaultValue : defaultValue;

const theme = writable(initialValue);

theme.subscribe((valor) => {
	Preferences.set({
		key: 'theme',
		value: valor
	});
});

export default theme;
