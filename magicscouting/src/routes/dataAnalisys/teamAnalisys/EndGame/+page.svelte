<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
    import { BarChartSimple, BarChartGrouped, DonutChart, RadarChart, ComboChart } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from '$app/navigation';
    import sessionStore from "$lib/shared/stores/sessionStorageStore";
    import { setupBarChartsData ,setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch } from "$lib/shared/scripts/chartUtilities";


    const teamData = sessionStore("selectedTeamData", {"logo": new Image(), "name":""});

    let rawData = writable(getTeamScoutingData($teamData.team));
    console.log($teamData.team)

    console.log($rawData)
    

</script>

{#if $teamData}
    <div class="border-color-5800-1 border-4 rounded-md">Team EPA: {$teamData.EPA}</div>
    <div class="border-color-5800-1 border-4 rounded-md">Winrate: {Math.round($teamData.winrate*100*10)/10}%</div>
    <img src={$teamData.logo.src} alt="Team Logo" />
    <div class="border-color-5800-1 border-4 rounded-md">Team: {$teamData.team}</div>
    <div>{$teamData.name}</div>    
{/if}
<svelte:component
    this={DonutChart}
    data={setupModeChartsData(
        $rawData,
        "bargeStatus",
        {
            "none": "None",
            "park": "Park",
            "deep": "Deep",
            "shallow": "Shallow" 
        },
    )}
    options={{
        theme: "g90",
        title: "Barge profile",
        height: "200px",
        width: "200px",
        axes: {
            left: { mapsTo: "value" },
            bottom: { mapsTo: "group", scaleType: "labels" }
            }
        }
    }
/> 
<div class="border-color-5800-1 border-4 rounded-md">Avg endgame climb time: {getAverageDBvalues(
    $rawData,
    ["bargeTime"],
    true
)}s</div>

<div class="border-color-5800-1 border-4 rounded-md">Avg endgame climb time: {getAverageDBvalues(
    $rawData,
    ["bargeStatus"],
    true
)}s</div>

    
{#if $rawData.length > 0}
 
    {#key $rawData}
        <svelte:component
            this={BarChartSimple}
            data={setupBarChartDataByMatch(
            $rawData,
                {
                    Score: {fields: ["bargeStatus"], valueName: "Points", showPoints: true}
                },
            )}
            options={{
                title: "Scoring profile",
                height: "400px",
                axes: {
                    left: {
                        title: "Score",
                        mapsTo: "Points"                        
                    },
                    bottom: {
                        scaleType: "labels",
                        title: "Match",
                        mapsTo: "key",
                    },
                },
            }}
        />
    {/key}
{/if}


<button on:click={() => {goto("/dataAnalisys/teamAnalisys")}}>Team Analisys</button>