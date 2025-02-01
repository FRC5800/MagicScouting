// @ts-nocheck
import dataBase from "$lib/shared/stores/dataBase.js";
import { get } from 'svelte/store';

export default async function uploadPayload(payload){
	delete payload.uploaded
	console.log(get(dataBase) + new URLSearchParams(payload))
	try{
		return self.fetch(get(dataBase) + new URLSearchParams(payload), {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
			},
		});
	}catch (e) {
		console.log(e);
		return {"text": ()=>{return JSON.stringify({"result": "Error"})}};
	}
}