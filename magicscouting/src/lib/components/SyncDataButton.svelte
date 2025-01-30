<script>
// @ts-nocheck

	import { TeamsDB, PitTeamsDB, MatchSchema, PitSchema } from "$lib/shared/stores/teamsData";
	import dataBase from "$lib/shared/stores/dataBase";
	import entriesSync from "$lib/shared/stores/toSyncData";

	function formatEntry(schema, data){
		let entry = {}
		for (let i = 0; i < schema.length; i++){
			entry[schema[i]] = data[i]
		}
		return entry
	}


	async function getSheetData(sheet){
		let sheetData = await fetch($dataBase + new URLSearchParams({sheet: sheet}),
		{
			method: "GET",
			headers: {
				"Content-Type": "text/plain",
			}
		}).then((r) => {
			return r.json()
		})

		sheetData = sheetData.data

		let schema = sheetData[0];
		sheetData = sheetData.splice(1)
		return {schema: schema, data: sheetData}
	}

	async function StoreSheetData(sheet, SchemaStore, DataStore){
		getSheetData(sheet).then((r) => {
			let schema = r.schema;
			let data = r.data;
			
			SchemaStore.set(schema);
			
			DataStore.set(data.map((line) => {
				return formatEntry(schema, line)
			}));
			
		})

	}

	export function SyncData(){
		if ($entriesSync.length != 0){
			alert("There are entries to sync, please sync them first or delete them.")
			return            
		}

		StoreSheetData("MagicScouting", MatchSchema, TeamsDB);
		StoreSheetData("PitScouting", PitSchema, PitTeamsDB);
		alert("Data Synced")
	}
	
	$: console.log($TeamsDB)
</script>

<button on:click={() => {SyncData()}}>Sync Data</button>
