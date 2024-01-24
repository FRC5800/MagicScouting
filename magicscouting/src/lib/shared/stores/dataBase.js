import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = '';
const initialValue = browser ? localStorage.getItem('dataBase') ?? defaultValue : defaultValue;

const dataBase = writable(initialValue);

dataBase.subscribe((value) => {
	if (browser) {
		localStorage.setItem('dataBase', value);
	}
});

export default dataBase;
