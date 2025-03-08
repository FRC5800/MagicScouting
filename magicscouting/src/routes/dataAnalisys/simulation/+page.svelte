<script>
    // @ts-nocheck
    
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";

    import { _ } from 'svelte-i18n';
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';

    import { DonutChart, RadarChart, LineChart, ComboChart, BarChartSimple, BarChartGrouped } from "@carbon/charts-svelte"

    import { writable } from "svelte/store";
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from "$app/navigation";
    import simulationData from "$lib/shared/stores/simulationData";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch, getDefaultLogo, setupAllianceChartData } from "$lib/shared/scripts/chartUtilities";
    import TeamSearchBar from "$lib/components/TeamSearchBar.svelte";
	import Toast from "$lib/components/Toast.svelte";
    import { allPoints, autoPoints, teleopPoints, algaePoints, coralPoints } from "$lib/shared/scripts/points";
	import AllianceSelector from "$lib/components/AllianceSelector.svelte";
	
    $: teamsAlliance1 = $simulationData ? writable(Object.keys($simulationData["alliance1"])) : writable([]);
    $: teamsAlliance2 = $simulationData ? writable(Object.keys($simulationData["alliance2"])) : writable([]);
    $: teamsData = $simulationData;

    function getAvgTeamPoints(team){
        return getAverageDBvalues(
                $simulationData[team].rawData,
                allPoints,
                true
            )
    }

    function getAvgAlliancePoints(allianceTeams, fields){
        let total = 0;
        allianceTeams.forEach(team => {
            total += getAverageDBvalues(
                $simulationData[team].rawData,
                fields,
                true
            )
        });
        return total
    }

	$: console.log(`Alliance 1 average: ${getAvgAlliancePoints($teamsAlliance1, allPoints)}`)
	$: console.log(`Alliance 2 average: ${getAvgAlliancePoints($teamsAlliance2, allPoints)}`)

    let lookupFields = {
        "Auto": autoPoints,
        "Teleop": teleopPoints,
        "Coral": coralPoints,
        "Algae": algaePoints,
        "Total": allPoints
    }

    function formatChartReference(allianceTeams){
        let chartData = {};
        allianceTeams.forEach(team => {
            chartData[team] = {fields: allPoints, teams: [team]}            
            })
        console.log(chartData)
        return chartData
    }

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i on:click={()=>{goto("/dataAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <h1 class="grow flex flex-row items-center text-2xl font-medium tracking-wide">{$_("dataAnalysis.matchAnalysis.title")}</h1>
    </div>

   <AllianceSelector 
        bind:simulationData={$simulationData} 
        storeMode="alliance1" />
    <AllianceSelector 
        bind:simulationData={$simulationData} 
        storeMode="alliance2" />
</main>

		<!-- 
    <section class="flex flex-col justify-center items-center w-full bg-[#f0f0f0] dark:bg-base-200 px-6 pb-10">
        <div class="w-full flex items-center justify-center mt-4">
            <div class="w-full relative my-2 mx-6 grow flex items-center flex-col">
                <h2 class="text-xl font-medium tracking-wide mb-2">{$_("dataAnalysis.matchAnalysis.points_subtitle")}</h2>
                <div class="flex flex-row justify-around items-center flex-wrap">
                    {#each Object.keys(lookupFields) as field}
                        <div class="grow-[2] basis-0 p-4 py-2 rounded-md flex flex-col items-center justify-center gap-2">
                            <h3>{field}</h3>
                            <span class="text-primary-base text-xl">{getAvgAlliancePoints($teams, lookupFields[field])}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <svelte:component
        this={DonutChart}
        data={setupAllianceChartData(
            formatChartReference($teams),
        )}
        options={{
            theme: $carbonTheme,
            title: $_("dataAnalysis.matchAnalysis.gp_points_teams"),
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

         <svelte:component
         this={BarChartSimple}
         data={setupAllianceChartData(
             {
                "L1" : {fields:["autoROneScore", "teleopROneScore"], teams: $teams}, 
                "L2" : {fields:["autoRTwoScore", "teleopRTwoScore"], teams: $teams}, 
                "L3" : {fields:["autoRThreeScore", "teleopRThreeScore"], teams: $teams}, 
                "L4" : {fields:["autoRFourScore", "teleopRFourScore"], teams: $teams},
                "Proc" : {fields:["teleopProcessorScore", "autoProcessorScore"], teams: $teams},
                "Net": {fields:["teleopNetScore", "autoNetScore"], teams: $teams} 
             },
         )}
         options={{
             theme: $carbonTheme,
             title: $_("dataAnalysis.matchAnalysis.gp_points_spots"),
             height: "200px",
             width: "85%",
             bars: {    
                    width: 10,
                },
             axes: {
                 bottom: { mapsTo: "value", scaleType: "linear"},
                 left: { mapsTo: "key", scaleType: "labels" },
                 }
             }
         }
          />

        <div class="divider"></div>

        <div class="w-full flex items-center justify-center">
            <div class=" w-full relative my-2 mx-6 grow flex flex-col items-center">
                <h2 class="text-xl font-medium tracking-wide mb-2">{$_("dataAnalysis.matchAnalysis.barge_subtitle")}</h2>
                <div class="flex flex-row justify-around items-center gap-2 flex-wrap">
                    {#each $teams as team}
                        <div class="grow-[2] basis-0 p-4 py-2 rounded-md flex flex-col items-center justify-center gap-2">
                            <h3>{team}</h3>
                            <span class="text-primary-base text-xl">{getAverageDBvalues(
                                $simulationData[team].rawData,
                                ["bargeTime"],
                                false
                            )}s</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section> -->

