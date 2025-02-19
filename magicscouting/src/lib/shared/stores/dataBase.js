// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = '';
const initialValue = browser ? localStorage.getItem('dataBase') ?? defaultValue : defaultValue;

const defaultUseDB = true;
const initialUseDB = browser ? (localStorage.getItem('useDB') === 'false' ? false : true) ?? defaultUseDB : defaultUseDB;


const dataBase = writable(initialValue);
export const useDB = writable(initialUseDB);

dataBase.subscribe((value) => {
	if (browser) {
		localStorage.setItem('dataBase', value);
	}
});

useDB.subscribe((value) => {
	if (browser) {
		localStorage.setItem('useDB', value);
	}
});

export default dataBase;
