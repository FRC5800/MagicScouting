// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = {
	alliance1: {},
	alliance2: {}
};
const initialValue = browser ? JSON.parse(localStorage.getItem('simulationData')) ?? defaultValue : defaultValue;

const simulationData = writable(initialValue);

simulationData.subscribe((value) => {
	if (browser) {
		localStorage.setItem('simulationData', JSON.stringify(value));
	}
});

export default simulationData;