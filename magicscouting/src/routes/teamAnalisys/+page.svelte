<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { BarChartSimple } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';



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

    $: data = {}

    let ready = false;
    onMount(async () => {
        let content = await fetch($dataBase + new URLSearchParams({sheet: "MagicScouting"}),
        {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
            }
        }).then((r) => {
            return r.json()
        })

        // ERRO AQUI ESTRUTURA DO JSON COM STATUS E DATA

        let schema = content[0];
        content = content.splice(1)

        console.log(schema)

        let allEntries = content.map((line) => {
            return formatEntry(schema, line)
        })
        
        data = allEntries

        ready = true;
    })

    $: teamSearch = "";
    
    $: autoCompleteTeams = writable([]);

    $: if (teamSearch != ""){
        console.log(teamSearch)
        autoCompleteTeams.set(data.filter((entry) => {
            return entry["team"].toString().includes(teamSearch) &&  entry["team"].toString() != teamSearch; 
        }))
        console.log(autoCompleteTeams)
    }else{
        autoCompleteTeams.set([])
    }

</script>

{#if ready}
    <input type="text" bind:value={teamSearch} placeholder="Team Number" class="bg-red-600" />
{/if} 

{#each $autoCompleteTeams as team}
    <div>
        <button on:click={() => {teamSearch=team.team}}>{team.team}</button>
    </div>
{/each}

<!-- <button on:click={}>Sync data</button> -->


<BarChartSimple
	data={formatToChart(data)}
	options={{
		theme: 'g90',
		title: 'Simple bar (discrete)',
		height: '400px',
		axes: {
			left: { mapsTo: 'value' },
			bottom: { mapsTo: 'group', scaleType: 'labels' }
		}
	}} />