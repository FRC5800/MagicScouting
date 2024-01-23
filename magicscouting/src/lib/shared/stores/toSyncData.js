import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const defaultValue = [];
const initialValue = defaultValue;
// initialValue = browser ? JSON.parse(window.localStorage.getItem('toSync')) ?? defaultValue : defaultValue;
 
const entriesSync = writable(initialValue);
 
entriesSync.subscribe((value) => {
  if (browser) {
    // window.localStorage.setItem('toSync', JSON.stringify(value));
  }
});
 
export default entriesSync;