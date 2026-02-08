<script>
    import { run } from 'svelte/legacy';

    // @ts-nocheck
    
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { getContext, onMount } from "svelte";

    import { _ } from 'svelte-i18n';
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';
    import { App } from '@capacitor/app';
    App.addListener("backButton", () => {goto("/dataAnalisys")});

    import { DonutChart, RadarChart, LineChart, ComboChart, BarChartSimple, BarChartGrouped } from "@carbon/charts-svelte"

    import { writable } from "svelte/store";
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from "$app/navigation";
    import matchAnalysisData from "$lib/shared/stores/matchAnalysisData";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch, getDefaultLogo, setupAllianceChartData } from "$lib/shared/scripts/chartUtilities";
    import TeamSearchBar from "$lib/components/TeamSearchBar.svelte";
	import Toast from "$lib/components/Toast.svelte";
    import { allPoints, autoPoints, teleopPoints, feedingPoints, fuelPoints, climbPoints } from "$lib/shared/scripts/points";
    // import { Keyboard } from "@capacitor/keyboard";

    let data = $derived($TeamsDB)
    let teamSearch = $state("");
    
    let selectedTeam = $state("");
    
    let showDeleteTeamButton = $state(0);
    
    let autoCompleteTeams = $derived(writable([]));
    let teams = $derived($matchAnalysisData ? writable(Object.keys($matchAnalysisData)) : writable([]));
    console.log("Teams: ")
    console.log($state.snapshot($teams))
    let teamsData = $derived($matchAnalysisData);
    let preventMoreTeams = $state(false);
    let showMaxTeamToast = $state(false);
    
    run(() => {
        if($teams.length == 3){preventMoreTeams = true}
        else{preventMoreTeams = false}
    });;
    
    run(() => {
        if(teamSearch != "" && preventMoreTeams){
            teamSearch = "";
            showMaxTeamToast = true;
        }
    });
    
    function handleTabClose(teamNumber){
        delete $matchAnalysisData[teamNumber];
        $matchAnalysisData = $matchAnalysisData;
        activeTab = ""
        if (Object.keys($matchAnalysisData).length > 0){
            activeTab = Object.keys($matchAnalysisData)[0];
        }
        console.log($matchAnalysisData);
    }
    
    function handleDeleteTeamButtonState(state){
        if (showDeleteTeamButton == state) {showDeleteTeamButton = 0}
        else if($teams[state-1]){showDeleteTeamButton = state}
    }
    
    function deleteTeam(team){
        showDeleteTeamButton = 0;
        delete teamsData[$teams[team-1]]
        $matchAnalysisData = teamsData;
    }
    
    
    run(() => {
        if($teams.length > 0){
            console.log($teams)
        }
    });
    
    function getAvgTeamPoints(team){
        return getAverageDBvalues(
            $matchAnalysisData[team].rawData,
            allPoints,
            true
        )
    }
    
    function getAvgAlliancePoints(allianceTeams, fields){
        let total = 0;
        allianceTeams.forEach(team => {
            total += getAverageDBvalues(
                $matchAnalysisData[team].rawData,
                fields,
                true
            )
        });
        return total
    }
    
    let lookupFields = {
        "Auto": autoPoints,
        "Teleop": teleopPoints,
        "Fuel": fuelPoints,
        "Climb": climbPoints,
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
    <div class="sm:w-[600px] w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i onclick={()=>{goto("/dataAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <h1 class="grow flex flex-row items-center text-2xl font-medium tracking-wide">{$_("dataAnalysis.matchAnalysis.title")}</h1>
    </div>

    <div class="w-full flex gap-4 mb-4 px-6 flex-col items-start sm:w-[600px]">
        <h2 class="text-xl font-medium tracking-wide">{$_("dataAnalysis.matchAnalysis.searchBar_text")}</h2>
        <TeamSearchBar bind:teamSearch={teamSearch} bind:selectedTeam={selectedTeam} bind:analysisData={$matchAnalysisData}/>
    </div>

    <div class="w-full flex mb-4 px-6 flex-row items-start h-fit sm:w-[600px]">
        <button onclick={()=>{handleDeleteTeamButtonState(1)}} class="indicator grow py-1 basis-1 btn btn-outline rounded-r-none">
            {#if showDeleteTeamButton == 1}
                <span onclick={()=>{deleteTeam(1)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
            {/if}
            <div>{$teams[0] ? $teams[0] : "No team"}</div>
            <br>
            <div class="text-primary-base">{$teams[0] ? getAvgTeamPoints($teams[0]) + " pts" : ""}</div>
        </button>
        <button onclick={()=>{handleDeleteTeamButtonState(2)}} class="indicator grow py-1 basis-1 btn btn-outline rounded-none">
            {#if showDeleteTeamButton == 2}
                <span onclick={()=>{deleteTeam(2)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
            {/if}
            <div>{$teams[1] ? $teams[1] : "No team"}</div>
            <br>
            <div class="text-primary-base">{$teams[1] ? getAvgTeamPoints($teams[1]) + " pts" : ""}</div>
        </button>
        <button onclick={()=>{handleDeleteTeamButtonState(3)}} class="indicator grow py-1 basis-1 btn btn-outline rounded-l-none">
            {#if showDeleteTeamButton == 3}
                <span onclick={()=>{deleteTeam(3)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
            {/if}
            <div>{$teams[2] ? $teams[2] : "No team"}</div>
            <br>
            <div class="text-primary-base">{$teams[2] ? getAvgTeamPoints($teams[2]) + " pts" : ""}</div>
        </button>
    </div>
    
    {#if $teams.length > 0}    
        <section class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-6 justify-center items-center w-full bg-[#f0f0f0] dark:bg-base-200 px-6 pb-10">
            <div class="w-full max-w-[400px] flex items-center justify-center mt-4">
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

            <DonutChart
            data={setupAllianceChartData(
                formatChartReference($teams),
            )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.average_points"),
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

            <BarChartSimple
            data={setupAllianceChartData(
                {
                    "Auto Climb" : {fields:["autoClimb"], teams: $teams}, 
                    "Teleop Climb" : {fields:["teleopClimb"], teams: $teams}, 
                    "Fuels" : {fields:["autoFuelNumber", "teleopFuelNumber"], teams: $teams},
                },
            )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.scoring_profile"),
                height: "200px",
                width: "300px",
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
                    <h2 class="text-xl font-medium tracking-wide mb-2">Auto Climbing</h2>
                    <div class="flex flex-row justify-around items-center gap-2 flex-wrap">
                        {#each $teams as team}
                            <div class="grow-[2] basis-0 p-4 py-2 rounded-md flex flex-col items-center justify-center gap-2">
                                <h3>{team}</h3>
                                <span class="text-primary-base text-xl">{getAverageDBvalues(
                                    $matchAnalysisData[team].rawData,
                                    ["autoClimbTime"],
                                    false
                                )}s</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="w-full flex items-center justify-center">
                <div class=" w-full relative my-2 mx-6 grow flex flex-col items-center">
                    <h2 class="text-xl font-medium tracking-wide mb-2">Teleop Climbing</h2>
                    <div class="flex flex-row justify-around items-center gap-2 flex-wrap">
                        {#each $teams as team}
                            <div class="grow-[2] basis-0 p-4 py-2 rounded-md flex flex-col items-center justify-center gap-2">
                                <h3>{team}</h3>
                                <span class="text-primary-base text-xl">{getAverageDBvalues(
                                    $matchAnalysisData[team].rawData,
                                    ["teleopClimbTime"],
                                    false
                                )}s</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </section>
    {/if}
</main>

<div>
    {$teams}
</div>

<Toast bind:showToast={showMaxTeamToast} message={"Max Teams per Alliance"} />