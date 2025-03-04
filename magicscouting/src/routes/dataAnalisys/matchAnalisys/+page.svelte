<script>
    // @ts-nocheck
    
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";

    import { carbonTheme } from '$lib/shared/stores/darkMode.js';

    import { DonutChart, RadarChart, LineChart, ComboChart } from "@carbon/charts-svelte"

    import { writable } from "svelte/store";
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from "$app/navigation";
    import matchAnalysisData from "$lib/shared/stores/matchAnalysisData";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch, getDefaultLogo } from "$lib/shared/scripts/chartUtilities";
    import TeamSearchBar from "$lib/components/TeamSearchBar.svelte";
	import Toast from "$lib/components/Toast.svelte";
    // import { Keyboard } from "@capacitor/keyboard";

    $: data = $TeamsDB
    $: teamSearch = "";
    $: selectedTeam = "";
    $: showDeleteTeamButton = 0;
    $: autoCompleteTeams = writable([]);
    $: teams = $matchAnalysisData ? Object.keys($matchAnalysisData) : [];
    $: teamsData = $matchAnalysisData;
    let preventMoreTeams = false;
    let showMaxTeamToast = false;

    $: if(teams.length == 3){preventMoreTeams = true}
    else{preventMoreTeams = false};

    $: if(teamSearch != "" && preventMoreTeams){
        teamSearch = "";
        showMaxTeamToast = true;
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

    let coralPoints = [
        "autoROneScore",
        "autoRTwoScore",
        "autoRThreeScore",
        "autoRFourScore",
        "teleopROneScore",
        "teleopRTwoScore",
        "teleopRThreeScore",
        "teleopRFourScore",
    ];
    let algaePoints = [
        "autoProcessorScore",
        "autoNetScore",
        "teleopProcessorScore",
        "teleopNetScore",
    ];

    function deleteArrayItem(array, itemIndex){
        let newArray = array.reduce(
            (acc, value, index) => {
                if(index != itemIndex){
                    acc.push(value);
                }
                return acc;
            }, [])
        return newArray;
    }

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
        else if(teams[state-1]){showDeleteTeamButton = state}
    }

    function deleteTeam(team){
        showDeleteTeamButton = 0;
        delete teamsData[teams[team-1]]
        $matchAnalysisData = teamsData;
    }

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex gap-4 mt-6 mb-6 flex-col items-center">
        <h1 class="text-2xl font-medium tracking-wide">Match Analiysis</h1>
    </div>

    <div class="w-full flex gap-4 mb-4 px-6 flex-col items-start">
        <h2 class="text-xl font-medium tracking-wide">Search for a team</h2>
        <TeamSearchBar bind:teamSearch={teamSearch} bind:selectedTeam={selectedTeam} bind:analysisData={$matchAnalysisData}/>
    </div>

    {#key teams}
        <div class="w-full flex mb-4 px-6 flex-row items-start">
            <button on:click={()=>{handleDeleteTeamButtonState(1)}} class="indicator grow basis-1 btn btn-outline rounded-r-none">
                {#if showDeleteTeamButton == 1}
                    <span on:click={()=>{deleteTeam(1)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
                {/if}
                <div>{teams[0] ? teams[0] : "No team"}</div>
            </button>
            <button on:click={()=>{handleDeleteTeamButtonState(2)}} class="indicator grow basis-1 btn btn-outline rounded-none">
                {#if showDeleteTeamButton == 2}
                    <span on:click={()=>{deleteTeam(2)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
                {/if}
                <div>{teams[1] ? teams[1] : "No team"}</div>
            </button>
            <button on:click={()=>{handleDeleteTeamButtonState(3)}} class="indicator grow basis-1 btn btn-outline rounded-l-none">
                {#if showDeleteTeamButton == 3}
                    <span on:click={()=>{deleteTeam(3)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
                {/if}
                <div>{teams[2] ? teams[2] : "No team"}</div>
            </button>
        </div>
    {/key}

    <section class="flex flex-col justify-center items-center w-full bg-[#f0f0f0] dark:bg-base-200 px-6 pb-6">
        Here go the charts
    </section>
</main>

<div>
    {teams}
</div>

<Toast bind:showToast={showMaxTeamToast} message={"Max Teams per Alliance"} />