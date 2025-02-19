// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const defaultValue = [];
let toSyncInitialValue = defaultValue;
let syncedInitialValue = defaultValue;
toSyncInitialValue = browser ? JSON.parse(window.localStorage.getItem('toSync')) ?? defaultValue : defaultValue;
syncedInitialValue = browser ? JSON.parse(window.localStorage.getItem('synced')) ?? defaultValue : defaultValue;
 
export const entriesSync = writable(toSyncInitialValue);
export const syncedEntries = writable(syncedInitialValue); 


entriesSync.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('toSync', JSON.stringify(value));
  }
});
 
syncedEntries.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('synced', JSON.stringify(value));
  }
});

export default entriesSync;