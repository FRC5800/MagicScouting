<script>
    import { run } from 'svelte/legacy';

// @ts-nocheck

	import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';
    import { _ } from 'svelte-i18n';

	import { BarChartStacked, BarChartGrouped } from '@carbon/charts-svelte'

    import { goto } from "$app/navigation";
    import { App } from '@capacitor/app';

    import SyncDataButton from "$lib/components/SyncDataButton.svelte";
    import { useDB } from "$lib/shared/stores/dataBase";
    import dataBase from "$lib/shared/stores/dataBase";

	import { TeamsDB, PitTeamsDB } from "$lib/shared/stores/teamsData";

    import { averageTeamPerformance, getSortedTeams, getAverageDBvalues, getTeamScoutingData, getAverageCycleData, validateLocalData, avgArray } from "$lib/shared/scripts/chartUtilities";
	import { writable } from "svelte/store";
	import Toast from "$lib/components/Toast.svelte";

    App.addListener("backButton", () => {goto("/")});

    let showDatabaseAlert = $state(false);
    let leaderboardData = $state([]);
    let avgCompetitionScore = $state(0);

    let avgCompetitionCycle = $state(0);

    let isDataBaseSet = $state();
	run(() => {
        if ($dataBase != '' && $dataBase != '?' || !$useDB) {
    		isDataBaseSet = true;
    	} else {
    		isDataBaseSet = false;
    	}
    });

    import { allPoints } from '$lib/shared/stores/gameKeys';

    let biggestScore = $state(50);
    function updateEventValues(TeamsData){
        let totalScore = [];
        let allTeams = getSortedTeams(TeamsData);
        console.log(allTeams);
        biggestScore = getAverageDBvalues(getTeamScoutingData(allTeams[allTeams.length-1]), allPoints, true)
        console.log(biggestScore);
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team)
            let teamScore = getAverageDBvalues(
                                            teamData,
                                            allPoints,
                                            true)
            if(teamScore != 0){
                totalScore.push(teamScore)
            }
        });

        avgCompetitionScore = Math.round(avgArray(totalScore))
        // avgCompetitionCycle = Math.round(avgArray(totalCycleAvg)*100)/100

        leaderboardData = averageTeamPerformance(allTeams)
        console.log(leaderboardData)
        console.log(leaderboardData.length)
    }

    onMount(async () => {
        if (validateLocalData(localStorage.getItem("TeamsDB"))){
            updateEventValues($TeamsDB)
        }
    })

    run(() => {
        updateEventValues($TeamsDB);
    });

    function triggerToast() {
      showDatabaseAlert = true;

      setTimeout(() => {
        showDatabaseAlert = false;
      }, 3000); // Disappears after 3 seconds
    }


</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white mb-16">
    <div class="w-full flex gap-4 px-6 mt-6 mb-6 flex-col items-center">
        <h1 class="text-2xl font-medium tracking-wide">{$_("dataAnalysis.title")}</h1>
    </div>
    {#if $TeamsDB.length > 0}

        <div class="w-full flex mb-3">
            <div class="bg-[#f0f0f0] dark:bg-surface w-full rounded-md relative p-4 my-2 mx-6 grow">
                <div class="flex flex-row justify-around items-center">
                    <div class="flex flex-col items-center justify-center gap-2">
                        <h3>{$_("dataAnalysis.average_points")}</h3>
                        <span class="text-primary-base text-xl">{avgCompetitionScore}</span>
                    </div>
                </div>
            </div>
        </div>

    {/if}
    <div class="w-full px-6 mb-6">
        <SyncDataButton/>
    </div>
    {#if $TeamsDB.length > 0}
        <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
            <h2 class="text-xl font-medium tracking-wide">{$_("dataAnalysis.analytics_subtitle")}</h2>

            <div class="w-full flex flex-col gap-2 ">
                <button onclick={() => {if(!isDataBaseSet){triggerToast()}else{goto('/dataAnalisys/teamAnalisys')}}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                    <i class="fi fi-rr-users-alt flex"></i>
                    <span>{$_("dataAnalysis.teams_analytics")}</span>
                    <div class="flex items-center justify-end grow">
                        <i class="fi fi-rr-angle-right flex"></i>
                    </div>
                </button>
                <button onclick={() => {if(!isDataBaseSet){triggerToast()}else{goto('/dataAnalisys/matchAnalisys')}}} class="btn btn-block flex flex-row justify-start bg-primary-opac text-primary-light gap-4">
                    <i class="fi fi-rr-columns-3 flex"></i>
                    <span>{$_("dataAnalysis.match_analytics")}</span>
                    <div class="flex items-center justify-end grow">
                        <i class="fi fi-rr-angle-right flex"></i>
                    </div>
                </button>
                <button onclick={() => {if(!isDataBaseSet){triggerToast()}else{goto('/dataAnalisys/picklist')}}} class="btn btn-block flex flex-row justify-start bg-primary-opac text-primary-light gap-4">
                    <i class="fi fi-rr-overview flex"></i>
                    <span>{$_("dataAnalysis.teams_picklist")}</span>
                    <div class="flex items-center justify-end grow">
                        <i class="fi fi-rr-angle-right flex"></i>
                    </div>
                </button>
                <button onclick={() => {if(!isDataBaseSet){triggerToast()}else{goto('/dataAnalisys/simulation')}}} class="btn btn-block flex flex-row justify-start bg-primary-opac text-primary-light gap-4">
                    <i class="fi fi-rr-dashboard-monitor flex"></i>
                    <span>{$_("dataAnalysis.match_simulation")}</span>
                    <div class="flex items-center justify-end grow">
                        <i class="fi fi-rr-angle-right flex"></i>
                    </div>
                </button>
            </div>

        </div>


        {#if leaderboardData.length > 0}
            <div class="w-full flex grow gap-4 px-6 flex-col items-start">
                <h2 class="text-xl font-medium tracking-wide">{$_("dataAnalysis.leaderboard_subtitle")}</h2>
            </div>

            <div class="w-full flex flex-col items-center mb-6">
                <BarChartStacked
                    data={leaderboardData}
                    options={{
                        toolbar: {enabled:false},
                        theme: $carbonTheme,
                        title: '',
                        height: String(50 + Math.max(leaderboardData.length * 5.5, 100))+"px",
                        width: '85%',
                        bars: {
                            width: 10,
                        },
                        axes: {
                            bottom: { mapsTo: 'value', scaleType: 'linear', domain: [0, biggestScore]},
                            left: { mapsTo: 'key', scaleType: 'labels' }
                            }
                        }
                    }
                />
            </div>
        {/if}
    {/if}
</main>

<Toast showToast={showDatabaseAlert} message={$_("dataAnalysis.database_alert")}/>
