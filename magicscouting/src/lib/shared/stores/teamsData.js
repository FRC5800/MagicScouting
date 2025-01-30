// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = "Not assigned";

export function parseLocalStorage(item) {
    return JSON.parse(localStorage.getItem(item));
}

const initialTeamsDB = browser ? (parseLocalStorage("TeamsDB") ?? defaultValue) : defaultValue;
const initialPitTeamsDB = browser ? (parseLocalStorage("PitTeamsDB") ?? defaultValue) : defaultValue;

const initialMatchSchema = browser ? (parseLocalStorage("MatchSchema") ?? defaultValue) : defaultValue;
const initialPitSchema = browser ? (parseLocalStorage("PitSchema") ?? defaultValue) : defaultValue;


export const TeamsDB = writable(initialTeamsDB);
export const MatchSchema = writable(initialMatchSchema);

export const PitTeamsDB = writable(initialPitTeamsDB);
export const PitSchema = writable(initialPitSchema);

TeamsDB.subscribe((value) => {
	if (browser) {
		localStorage.setItem('TeamsDB', JSON.stringify(value));
	}
});

PitTeamsDB.subscribe((value) => {
	if (browser) {
		localStorage.setItem('PitTeamsDB', JSON.stringify(value));
	}
});

MatchSchema.subscribe((value) => {
	if (browser) {
		localStorage.setItem('MatchSchema', JSON.stringify(value));
	}
});

PitSchema.subscribe((value) => {
	if (browser) {
		localStorage.setItem('PitSchema', JSON.stringify(value));
	}
});


export default {TeamsDB, PitTeamsDB, MatchSchema, PitSchema};
