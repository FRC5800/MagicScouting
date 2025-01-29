<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { BarChartSimple } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
	import { TeamsDB } from "$lib/shared/stores/teamsData";



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

    $: data = $TeamsDB
    console.log(data)

    $: teamSearch = "";
    
    $: autoCompleteTeams = writable([]);

    $: teamData = {"logo": new Image(), "name":""};
    async function getTBAData(team){
        let requestData = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/simple`,
            {
                method: "GET",
                headers: {
                    "X-TBA-Auth-Key": "ua8GRX5X4m3IKgFxkruldDLonsaOlAc8GTlK0DLdIsUUYkTfda8KaHaKbaUEsDTq"
                }
            }
        ).then((r) => {
            return r.json()
        })
        let image = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/media/2025`,
            {
                method: "GET",
                headers: {
                    "X-TBA-Auth-Key": "ua8GRX5X4m3IKgFxkruldDLonsaOlAc8GTlK0DLdIsUUYkTfda8KaHaKbaUEsDTq"
                }
            }
        ).then((r) => {
            return r.json()
        })
        if (team == teamSearch){
            teamData.logo.src = "data:image/png;base64," + image[0].details.base64Image
            teamData.name = requestData.nickname
        }
    }
    function getTeamScoutingData(team){
        let teamData = $TeamsDB.filter((entry) => {
            return entry["team"] == team
        })
        return teamData
    }

    let debounceTimeout;

    $: if (teamSearch != "") {
        console.log(teamSearch);
        let alreadyIn = [];
        let filterSugestions = data.filter((entry) => {
            let condition = entry["team"].toString().includes(teamSearch) && entry["team"].toString() != teamSearch && !alreadyIn.includes(entry["team"].toString());
            alreadyIn.push(entry["team"].toString());
            return condition;
        });

        autoCompleteTeams.set(filterSugestions);
        console.log(autoCompleteTeams);
        
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            console.log(getTeamScoutingData(teamSearch));
            await getTBAData(teamSearch);
        }, 300); // Adjust the debounce delay as needed
    } else {
        autoCompleteTeams.set([]);
    }

</script>

<input type="text" bind:value={teamSearch} placeholder="Team Number" class="bg-red-600" />

<img src={teamData.logo.src} alt="Team Logo" />
<div>{teamData.name}</div>

{#each $autoCompleteTeams as team}
    <div>
        <button on:click={() => {teamSearch=team.team}}>{team.team}</button>
    </div>
{/each}


<!-- <button on:click={}>Sync data</button> -->


<!-- <BarChartSimple
	data={formatToChart(data[0])}
	options={{
		theme: 'g90',
		title: 'Simple bar (discrete)',
		height: '400px',
		axes: {
			left: { mapsTo: 'value' },
			bottom: { mapsTo: 'group', scaleType: 'labels' }
		}
	}} /> -->