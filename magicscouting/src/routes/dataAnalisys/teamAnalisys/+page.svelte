<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { DonutChart, RadarChart } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
	import { TeamsDB } from "$lib/shared/stores/teamsData";

	import { goto } from '$app/navigation';
    import sessionStore from "$lib/shared/stores/sessionStorageStore";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData } from "$lib/shared/scripts/chartUtilities";


    $: data = $TeamsDB
    console.log(data)

    $: teamSearch = "";
    
    $: autoCompleteTeams = writable([]);

    const teamData = sessionStore("selectedTeamData", {"team": "", "logo": new Image(), "name":"", "winrate":"", "EPA":""});

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

            $teamData.team = teamSearch

            getStatBoticsData(teamSearch).then((r) => {
                if (r.team == teamSearch){
                    $teamData.winrate = r.winrate
                    $teamData.EPA = r.epa

                }
            })

            getTBAData(teamSearch).then((r) => {
                if (r.team == teamSearch){
		            $teamData.logo.src = r.logo
		            $teamData.name = r.name
            	}
            });
        }, 300); // Adjust the debounce delay as needed
    } else {
        autoCompleteTeams.set([]);
    }



</script>



<input type="text" bind:value={teamSearch} placeholder="Team Number" class="bg-red-600" />

{#if $teamData}
    <div class="border-color-5800-1 border-4 rounded-md">Team EPA: {$teamData.EPA}</div>
    <div class="border-color-5800-1 border-4 rounded-md">Winrate: {$teamData.winrate}</div>
    <img src={$teamData.logo.src} alt="Team Logo" />
    <div>{$teamData.name}</div>
{/if}
{#each $autoCompleteTeams as team}
    <div>
        <button on:click={() => {teamSearch=team.team}}>{team.team}</button>
    </div>
{/each}

<svelte:component
    this={DonutChart}
    data={setupSimpleChartsData(
        $rawData,
        {
            "Coral" : ["autoROneScore", "autoRTwoScore", "autoRThreeScore", "autoRFourScore","teleopROneScore", "teleopRTwoScore", "teleopRThreeScore", "teleopRFourScore"], 
            "Processor": ["autoProcessorScore", "teleopProcessorScore"], 
            "Net": ["autoNetScore", "teleopNetScore"]
        },
    )}
    options={{
        theme: 'g90',
        title: "Game Piece Points",
        height: '200px',
        width: '200px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'group', scaleType: 'labels' }
            }
        }
    }
/> 

<svelte:component
    this={DonutChart}
    data={setupSimpleChartsData(
        $rawData,
        {
            "Auto" : ["autoROneScore", "autoRTwoScore", "autoRThreeScore", "autoRFourScore", "autoProcessorScore", "autoNetScore", "isLeave"], 
            "Teleop": ["teleopROneScore", "teleopRTwoScore", "teleopRThreeScore", "teleopRFourScore", "teleopProcessorScore", "teleopNetScore"], 
            "Endgame": ["bargeStatus"]
        },
    )}
    options={{
        theme: 'g90',
        title: 'Points By Game State',
        height: '200px',
        width: '200px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'group', scaleType: 'labels' }
            }
        }
    }
/> 
{#if teamSearch != ""}
    <RadarChart
        data={setupSimpleChartsData(
            $rawData,
            {
                "Auto" : ["autoROneScore", "autoRTwoScore", "autoRThreeScore", "autoRFourScore", "autoProcessorScore", "autoNetScore", "isLeave"], 
                "Teleop": ["teleopROneScore", "teleopRTwoScore", "teleopRThreeScore", "teleopRFourScore", "teleopProcessorScore", "teleopNetScore"], 
                "Endgame": ["bargeStatus"]
            },
            "radar"
        )}
        options={{
            title: 'Radar',
            radar: {
                axes: {
                    angle: 'feature',
                    value: 'score'
                }
            },
            data: {
            groupMapsTo: 'product'
            },
            height: '400px'
        }}
    />
{/if}

<button on:click={() => {goto("/dataAnalisys/teamAnalisys/pitData")}}>Pit Data</button>