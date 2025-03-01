<script>
// @ts-nocheck

	import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';

	import { BarChartStacked, BarChartGrouped } from '@carbon/charts-svelte'

    import { goto } from "$app/navigation";

    import SyncData from "$lib/components/SyncDataButton.svelte";
    import SyncDataButton from "$lib/components/SyncDataButton.svelte";
    import { useDB } from "$lib/shared/stores/dataBase";
    import dataBase from "$lib/shared/stores/dataBase";

	import { TeamsDB, PitTeamsDB, MatchSchema, PitSchema } from "$lib/shared/stores/teamsData";

    import { avgTeamPerformance, getSortedTeams, getAverageDBvalues, getTeamScoutingData, getAverageCycleData } from "$lib/shared/scripts/chartUtilities";
	import { writable } from "svelte/store";

    let showDatabaseAlert = false;
    let leaderboardData = writable([]);
    $: avgCompetitionScore = 0;
    $: avgCompetitionCycle = 0;
    let isDataBaseSet;
	$: if ($dataBase != '' && $dataBase != '?' || !$useDB) {
		isDataBaseSet = true;
	} else {
		isDataBaseSet = false;
	}

    let allPoints = [
        "autoROneScore",
        "autoRTwoScore",
        "autoRThreeScore",
        "autoRFourScore",
        "autoProcessorScore",
        "autoNetScore",
        "isLeave",
        "teleopROneScore",
        "teleopRTwoScore",
        "teleopRThreeScore",
        "teleopRFourScore",
        "teleopProcessorScore",
        "teleopNetScore",
        "bargeStatus"
    ];

    let biggestScore = 50;
    function updateEventValues(){
        let totalCycleAvg = 0;
        let totalScore = 0;
        let allTeams = getSortedTeams($TeamsDB); 
        biggestScore = getAverageDBvalues(getTeamScoutingData(allTeams[allTeams.length-1]), allPoints, true)
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team)
            totalScore += getAverageDBvalues(
                                            teamData,
                                            allPoints,
                                            true
                                            )
    
            totalCycleAvg += getAverageCycleData(
                            teamData,
                            [
                                "coralStationCycleTime",
                                "coralFloorCycleTime",
                                "algaeCycleTime"
                            ],
                        )
        });
    
        avgCompetitionScore = Math.round(totalScore/allTeams.length)
        avgCompetitionCycle = Math.round((totalCycleAvg/allTeams.length)*100)/100
    
        leaderboardData.set(avgTeamPerformance(getSortedTeams($TeamsDB)))
        console.log($leaderboardData)

    }

    onMount(async () => {
        if (localStorage.getItem("MatchSchema") == "Not assigned" || localStorage.getItem("PitSchema") == "Not assigned"){
            SyncData();
        }

        updateEventValues()
    })

    $: $TeamsDB, updateEventValues();

    function triggerToast() {
      showDatabaseAlert = true;
      
      setTimeout(() => {
        showDatabaseAlert = false;
      }, 3000); // Disappears after 3 seconds
    }

    
</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex gap-4 px-6 mt-6 mb-6 flex-col items-center">
        <h1 class="text-2xl font-medium tracking-wide">Dashboard</h1>
    </div>

    <div class="w-full flex mb-3">
        <div class="bg-[#f0f0f0] dark:bg-surface w-full rounded-md relative p-4 my-2 mx-6 grow">
            <div class="flex flex-row justify-around items-center">
                <div class="flex flex-col items-center justify-center gap-2">
                    <h3>Average Points</h3>
                    <span class="text-primary-base text-xl">{avgCompetitionScore}</span>
                </div>
                <div class="flex flex-col items-center justify-center gap-2">
                    <h3>Average Cycle</h3>
                    <span class="text-primary-base text-xl">{avgCompetitionCycle}s</span>
                </div>
            </div>
        </div>
    </div>

    <div class="w-full px-6 mb-6">
        
        <SyncDataButton />
    </div>

    <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
        <h2 class="text-xl font-medium tracking-wide">Analytics</h2>
        
        <div class="w-full flex flex-col gap-2 ">
            <button on:click={() => {if(!isDataBaseSet){triggerToast()}else{goto('/dataAnalisys/teamAnalisys')}}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                <i class="fi fi-rr-users-alt flex"></i>
                <span>Team Analisys</span>
                <div class="flex items-center justify-end grow">
                    <i class="fi fi-rr-angle-right flex"></i>
                </div>
            </button>
            <div class="btn btn-block flex flex-row justify-start btn-disabled gap-4">
                <i class="fi fi-rr-columns-3 flex"></i>
                <span>Match Analisys</span>
            </div>
            <div class="btn btn-block flex flex-row justify-start btn-disabled gap-4">
                <i class="fi fi-rr-overview flex"></i>
                <span>Teams Picklist</span>
            </div>
            <div class="btn btn-block flex flex-row justify-start btn-disabled gap-4">
                <i class="fi fi-rr-dashboard-monitor flex"></i>
                <span>Match Simulation</span>
            </div>
        </div>

      </div>

      
      {#if $leaderboardData.length > 0}
        <div class="w-full flex grow gap-4 px-6 flex-col items-start">
            <h2 class="text-xl font-medium tracking-wide">Leaderboard</h2>
        </div>

        <div class="w-full flex flex-col items-center mb-6">
            <svelte:component
            this={BarChartStacked}
                data={$leaderboardData}
                options={{
                    theme: $carbonTheme,
                    title: '',
                    height: '500px',
                    width: '70%',
                    bars: {    
                        width: 10,
                    },
                    axes: {
                        bottom: { mapsTo: 'value', scaleType: "linear", domain: [0, biggestScore]},
                        left: { mapsTo: 'key', scaleType: 'labels' }
                        }
                    }
                }
            /> 
        </div>
        {/if}
</main>

<div transition:fade class="toast toast-top toast-end">
    {#if showDatabaseAlert}
      <div class="alert alert-warning shadow-lg">
        <span class="select-none">Warning! Set your database first</span>
      </div>
    {/if}
</div>