// @ts-nocheck
import { writable } from 'svelte/store';

function localStorageStore(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    const data = storedValue ? JSON.parse(storedValue) : initialValue;
    const store = writable(data);

    store.subscribe(value => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export default localStorageStore;