// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = {};
const initialValue = browser ? JSON.parse(localStorage.getItem('teamAnalysisData')) ?? defaultValue : defaultValue;

const teamAnalysisData = writable(initialValue);

teamAnalysisData.subscribe((value) => {
	if (browser) {
		localStorage.setItem('teamAnalysisData', JSON.stringify(value));
	}
});

export default teamAnalysisData;