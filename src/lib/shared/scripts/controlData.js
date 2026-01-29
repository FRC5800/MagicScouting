// @ts-nocheck
export default function storeData(payload) {
	for (var key in payload) {
		localStorage.setItem(key, payload[key]);
	}
}
