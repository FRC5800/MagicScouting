<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';
    import { _ } from 'svelte-i18n';
    import { App } from '@capacitor/app';
    App.addListener("backButton", () => {goto("/dataAnalisys/teamAnalisys")});

    import { BarChartSimple, BarChartGrouped, DonutChart, RadarChart, ComboChart } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from '$app/navigation';
    import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";
    import { setupBarChartsData ,setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch, getParameterArray } from "$lib/shared/scripts/chartUtilities";

    export let data;
    let teamData = $teamAnalysisData[data.selectedTeam];

    let rawData = writable(getTeamScoutingData(teamData.team));
    console.log(teamData.team)

    console.log($rawData)
    

</script>

{#if teamData}
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i on:click={()=>{goto("/dataAnalisys/teamAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <div class="grow flex flex-row gap-4 items-center">

            <img width="50px" src={teamData.logo} alt="Team Logo" />
            <div class="flex flex-row gap-2">
                <div>{teamData.team}</div>
                <div>{teamData.name}</div>
            </div>
        </div>
    </div>   
{/if}

<div class="w-full px-6 mb-16 flex flex-col items-center">
    {#if $rawData.length > 0}
        <div class="w-full flex">
            <div class=" w-full relative mb-2 mx-6 grow">
                <div class="flex flex-row justify-around items-center gap-2">
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>{$_("dataAnalysis.teamAnalysis.barge_points")}</h3>
                        <span class="text-primary-base text-xl">{getAverageDBvalues(
                            $rawData,
                            ["bargeStatus"],
                            true
                        )}</span>
                    </div>
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>{$_("dataAnalysis.teamAnalysis.barge_time")}</h3>
                        <span class="text-primary-base text-xl">{getAverageDBvalues(
                            $rawData,
                            ["bargeTime"],
                            false
                        )}s</span>
                    </div>
                </div>
            </div>
        </div>

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
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.barge_profile"),
                height: "300px",
                width: "300px",
                axes: {
                    left: { mapsTo: "value" },
                    bottom: { mapsTo: "group", scaleType: "labels" }
                    }
                }
            }
        /> 
    
        <div class="divider"></div>

        <div class="overflow-x-auto w-full">
            <table class="table">
                <thead>
                    <th>Match</th>
                    <th>Climb</th>
                </thead>
                <tbody>
                    {#key $rawData}
                        {#each $rawData.slice().sort((a,b) => a.match - b.match) as status}
                            <tr>
                                <th>{status.match}</th>
                                <td>{status.bargeStatus}</td>
                            </tr>
                        {/each}
                    {/key}
                </tbody>
            </table>
        </div>
        
    {/if}


    <div class="divider"></div>
</div>