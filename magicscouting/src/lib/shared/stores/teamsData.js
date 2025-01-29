// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = "Not assigned";

const initialTeamsDB = browser ? (localStorage.getItem('TeamsDB') ?? defaultValue) : defaultValue;
const initialPitTeamsDB = browser ? (localStorage.getItem('PitTeamsDB') ?? defaultValue) : defaultValue;

const initialMatchSchema = browser ? (localStorage.getItem('MatchSchema') ?? defaultValue) : defaultValue;
const initialPitSchema = browser ? (localStorage.getItem('PitSchema') ?? defaultValue) : defaultValue;


export const TeamsDB = writable(initialPitTeamsDB);
export const MatchSchema = writable(initialMatchSchema);

export const PitTeamsDB = writable(initialTeamsDB);
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

export function getTeamsDB() {
    return JSON.parse(localStorage.getItem('TeamsDB'));
}
export function getPitTeamsDB() {
    return JSON.parse(localStorage.getItem('PitTeamsDB'));
}
export function getMatchSchema() {
    return JSON.parse(localStorage.getItem('MatchSchema'));
}
export function getPitSchema() {
    return JSON.parse(localStorage.getItem('PitSchema'));
}

export default {TeamsDB, PitTeamsDB, MatchSchema, PitSchema, getPitTeamsDB, getTeamsDB, getMatchSchema, getPitSchema};
