<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { BarChartGrouped } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
	import { TeamsDB } from "$lib/shared/stores/teamsData";

	import { goto } from '$app/navigation';
    import sessionStore from "$lib/shared/stores/sessionStorageStore";

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

    const teamData = sessionStore("selectedTeamData", {"logo": new Image(), "name":""});

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
            $teamData.logo.src = "data:image/png;base64," + image[0].details.base64Image
            $teamData.name = requestData.nickname
        }
    }
    function getTeamScoutingData(team){
        let teamData = $TeamsDB.filter((entry) => {
            return entry["team"] == team
        })
        return teamData
    }

    function getEntryArray(data, param){
        let entryArray = []
        data.forEach((e) => {
            entryArray.push(e[param])
        })
        return entryArray
    }

    function avgArray(array){
        let sum = 0
        array.forEach((e) => {
            sum += e
        })
        return sum/array.length
    }

    function setupChartsDataScore(data, chartLabels, chartReference, namePatterns=["Score", "Miss"]){
        if (!data){return []}
        
        let chartData = []

        chartReference.forEach((e) => {
            namePatterns.forEach((pattern) => {
                let bar = {
                    "key": chartLabels[chartReference.indexOf(e)],
                    "group": pattern,
                    "value": avgArray(getEntryArray(data, e+pattern))
                }
                chartData.push(bar)
            })
            
        })
        
        

        let teleopRFourScore = getEntryArray(data, "teleopRFourScore")
        
        console.log(chartData)
        return chartData
    }

    let debounceTimeout;

    let rawData = writable([]);

    $: if (teamSearch != "") {
        console.log(teamSearch);
        let alreadyIn = [];
        let filterSugestions = data.filter((entry) => {
            let condition = entry["team"].toString().includes(teamSearch) && entry["team"].toString() != teamSearch && !alreadyIn.includes(entry["team"].toString());
            alreadyIn.push(entry["team"].toString());
            return condition;
        });

        autoCompleteTeams.set(filterSugestions);
        
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            console.log(getTeamScoutingData(teamSearch))
            rawData.set(getTeamScoutingData(teamSearch));

            await getTBAData(teamSearch);
        }, 300); // Adjust the debounce delay as needed
    } else {
        autoCompleteTeams.set([]);
    }

    function handlePitScouting(){
        
        goto("/pitData")
    }


</script>

<input type="text" bind:value={teamSearch} placeholder="Team Number" class="bg-red-600" />

<img src={$teamData.logo.src} alt="Team Logo" />
<div>{$teamData.name}</div>

{#each $autoCompleteTeams as team}
    <div>
        <button on:click={() => {teamSearch=team.team}}>{team.team}</button>
    </div>
{/each}

<svelte:component
    this={BarChartGrouped}
    data={setupChartsDataScore(
        $rawData,
        ["L1", "L2", "L3", "L4"],
        ["autoROne", "autoRTwo", "autoRThree", "autoRFour"],
    )}
    options={{
        theme: 'g90',
        title: 'AUTO CORAL',
        height: '200px',
        width: '400px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 
<svelte:component
    this={BarChartGrouped}
    data={setupChartsDataScore(
        $rawData,
        ["L1", "L2", "L3", "L4"],
        ["teleopROne", "teleopRTwo", "teleopRThree", "teleopRFour"]
    )}
    options={{
        theme: 'g90',
        title: 'TELEOP CORAL',
        height: '200px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 

<svelte:component
    this={BarChartGrouped}
    data={setupChartsDataScore(
        $rawData,
        ["Auto Processor", "Auto Net", "Teleop Processor", "Teleop Net"],
        ["autoProcessor", "autoNet", "teleopProcessor", "teleopNet"],
    )
    }
    options={{
        theme: 'g90',
        title: 'ALGAE',
        height: '200px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 

<button on:click={handlePitScouting}>Pit Data</button>

<button on:click={() => {goto("/dataAnalisys")}} class="bg-white">Pit Data</button>
