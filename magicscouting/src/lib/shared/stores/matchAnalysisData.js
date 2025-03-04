// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = {};
const initialValue = browser ? JSON.parse(localStorage.getItem('matchAnalysisData')) ?? defaultValue : defaultValue;

const matchAnalysisData = writable(initialValue);

matchAnalysisData.subscribe((value) => {
	if (browser) {
		localStorage.setItem('matchAnalysisData', JSON.stringify(value));
	}
});

export default matchAnalysisData;