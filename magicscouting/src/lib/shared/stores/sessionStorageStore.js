import { writable } from 'svelte/store';

// @ts-ignore
function sessionStore(key, initialValue) {
    const storedValue = sessionStorage.getItem(key);
    const data = storedValue ? JSON.parse(storedValue) : initialValue;
    const store = writable(data);

    store.subscribe(value => {
        sessionStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}

export default sessionStore;