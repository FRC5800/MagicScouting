<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { BarChartSimple } from '@carbon/charts-svelte'

    import { goto } from "$app/navigation";
    import { TeamsDB, PitTeamsDB, MatchSchema, PitSchema, getPitTeamsDB, getTeamsDB, getMatchSchema, getPitSchema } from "$lib/shared/stores/teamsData";
    import entriesSync from "$lib/shared/stores/toSyncData";


    Object.filter = (obj, predicate) => 
                  Object.fromEntries(Object.entries(obj).filter(predicate));

    function isNumeric(str) { 
        return !isNaN(str) && !isNaN(parseFloat(str))
    }


    function formatEntry(schema, data){
        let entry = {}
        for (let i = 0; i < schema.length; i++){
            entry[schema[i]] = data[i]
        }
        return entry
    }

    function formatToChart(entry){
        let chartData = []
        
        for (let i = 0; i < Object.keys(entry).length; i++){
            let key = Object.keys(entry)[i]
            let value = Object.values(entry)[i]
            chartData.push({group: key, value: value})
        }

        return chartData
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
            console.log(data)
            
        })

    }

    function SyncData(){
        if ($entriesSync.length != 0){
            alert("There are entries to sync, please sync them first or delete them.")
            return            
        }

        StoreSheetData("MagicScouting", MatchSchema, TeamsDB);
        StoreSheetData("PitScouting", PitSchema, PitTeamsDB);
        alert("Data Synced")
    }

    $: data = {}

    onMount(async () => {
        if (localStorage.getItem("MatchSchema") == "Not assigned" || localStorage.getItem("PitSchema") == "Not assigned"){
            SyncData();
        }
    })

    
    
</script>

<button on:click={() => {SyncData()}}>Sync Data</button>
<button on:click={() => {goto('/teamAnalisys')}}>Team Analisys</button>


<!-- 
['timeStamp', 'team', 'match', 'arenaPos', 'red/blue', 
'autoROneScore', 'autoRTwoScore', 'autoRThreeScore', 'autoRFourScore', 
'autoROneMiss', 'autoRTwoMiss', 'autoRThreeMiss', 'autoRFourMiss', 
'isLeave', 
’autoProcessorScore’, 'autoProcessorMiss’, 
‘autoRemoveAlgaeLow’, ‘autoRemoveAlgaeHigh’, 
'teleopROneScore', 'teleopRTwoScore', 'teleopRThreeScore', 'teleopRFourScore', 
'teleopROneMiss', 'teleopRTwoMiss', 'teleopRThreeMiss', 'teleopRFourMiss', 
’teleopProcessorScore’, ‘teleopProcessorMiss’, 
‘teleopRemoveAlgaeLow’, ‘teleopRemoveAlgaeHigh’, 
'bargeStatus', 'bargeTime', 'stationCycleTime', 'floorCycleTime', ‘netScore’, 'humanNetScore', ‘netMiss’, 'humanNetMiss', 'matchFunction', 'stationAverage', 'floorAverage'] -->