<script>
// @ts-nocheck
	import { onMount } from "svelte";
	import { TeamsDB, PitTeamsDB, MatchSchema, PitSchema } from "$lib/shared/stores/teamsData";
	import dataBase from "$lib/shared/stores/dataBase";
	import entriesSync from "$lib/shared/stores/toSyncData";
	import { useDB }  from '$lib/shared/stores/dataBase';
	import { validateLocalData } from "$lib/shared/scripts/chartUtilities";
	import { _ } from 'svelte-i18n';
	import matchAnalysisData from "$lib/shared/stores/matchAnalysisData";
	import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";
	import simulationData from "$lib/shared/stores/simulationData";


	let isSyncing = false;
	let isDataBaseSet;
	$: if ($dataBase != '' && $dataBase != '?' || !$useDB) {
		isDataBaseSet = true;
	} else {
		isDataBaseSet = false;
	}

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
		await getSheetData(sheet).then((r) => {
			let schema = r.schema;
			let data = r.data;
			
			SchemaStore.set(schema);
			
			DataStore.set(data.map((line) => {
				return formatEntry(schema, line)
			}));
			
		})

	}
	
	$: buttonText = $_("dataAnalysis.sync_button")

	async function SyncData(){
		if ($entriesSync.length != 0){
			alert("There are entries to sync, please sync them first or delete them.")
			return            
		}

		isSyncing = true;
		try {
			await Promise.allSettled([
				StoreSheetData("MagicScouting", MatchSchema, TeamsDB),
				StoreSheetData("PitScouting", PitSchema, PitTeamsDB)
			]);
			buttonText = "Data Synced"
			setTimeout(() => {buttonText = "Sync Data"}, 3500);

			matchAnalysisData.set({})
      		teamAnalysisData.set({})
			simulationData.set({})
			

		}catch (error){
			alert("Sync error")
			console.log("Error Syncing data: "+ error)
		}
		isSyncing = false;

	}
	

	onMount(async () => {
		let testDB = localStorage.getItem("TeamsDB")
        if (!validateLocalData(testDB) && isDataBaseSet){
            SyncData();
        }
	})
	// $: console.log($TeamsDB)
</script>

<button disabled={!isDataBaseSet} class="{!isDataBaseSet ? "btn-disabled skeleton" : ""} m-0 btn btn-block {buttonText=="Data Synced" ? "bg-green-700" : ""}" on:click={() => {SyncData()}}>
	{#if isSyncing}
	<span class="loading loading-spinner"></span>
	{:else}
		{buttonText}
	{/if}
</button>

{#if $dataBase == ""}
<div class="flex flex-row justify-center">
	<span class="text-warning">{$_("dataAnalysis.database_alert")}</span>
</div>
{/if}
