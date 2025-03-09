<script>
    // @ts-nocheck
    
    import { onMount } from "svelte";

    import { _ } from 'svelte-i18n';
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';

    import { writable } from "svelte/store";
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import TeamSearchBar from "$lib/components/TeamSearchBar.svelte";
	import Toast from "$lib/components/Toast.svelte";
	import { getAverageDBvalues } from "$lib/shared/scripts/chartUtilities";
    import { allPoints } from "$lib/shared/scripts/points";
    import matchAnalysisData from "$lib/shared/stores/matchAnalysisData";
	import { goto } from "$app/navigation";


	export let dataStore = "alliance1";
	export let simulationData; 
    export let title = "Alliance 1";


    $: teamSearch = "";
    $: showDeleteTeamButton = 0;

    $: teams = simulationData ? writable(Object.keys(simulationData[dataStore])) : writable([]);
    $: teamsData = simulationData[dataStore];

    let preventMoreTeams = false;
    let showMaxTeamToast = false;

    $: if($teams.length == 3){
		preventMoreTeams = true
	}else{
		preventMoreTeams = false
	};

    $: if(teamSearch != "" && preventMoreTeams){
        teamSearch = "";
        showMaxTeamToast = true;
    }

    function handleTabClose(teamNumber){
        delete simulationData[dataStore][teamNumber];
        simulationData = simulationData;

        console.log(simulationData);
    }
    
    function handleDeleteTeamButtonState(state){
        if (showDeleteTeamButton == state) {
			showDeleteTeamButton = 0
		}else if($teams[state-1]){
			showDeleteTeamButton = state
		}
    }

    function deleteTeam(team){
        showDeleteTeamButton = 0;
        delete teamsData[$teams[team-1]]
        simulationData[dataStore] = teamsData;
    }

    function getAvgTeamPoints(team){
        return getAverageDBvalues(
                simulationData[dataStore][team].rawData,
                allPoints,
                true
            )
    }

    $: if($teams.length > 0){
        console.log($teams)
    }

    function analyseAlliance(){
        matchAnalysisData.set(simulationData[dataStore])
        goto("/dataAnalisys/matchAnalisys")
    }

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex gap-4 mb-4 px-6 flex-col items-start">
        <h2 class="text-xl font-medium tracking-wide">{title}</h2>
        <TeamSearchBar bind:teamSearch={teamSearch} bind:analysisData={simulationData} storeMode={dataStore}/>
    </div>

    
    <div class="w-full flex mb-1 px-6 flex-row items-start h-fit">
        <button on:click={()=>{handleDeleteTeamButtonState(1)}} class="indicator grow py-1 basis-1 btn btn-outline rounded-r-none">
            {#if showDeleteTeamButton == 1}
                <span on:click={()=>{deleteTeam(1)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
            {/if}
            <div>{$teams[0] ? $teams[0] : "No team"}</div>
            <br>
            <div class="text-primary-base">{$teams[0] ? getAvgTeamPoints($teams[0]) + " pts" : ""}</div>
        </button>
        <button on:click={()=>{handleDeleteTeamButtonState(2)}} class="indicator grow py-1 basis-1 btn btn-outline rounded-none">
            {#if showDeleteTeamButton == 2}
                <span on:click={()=>{deleteTeam(2)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
                {/if}
                <div>{$teams[1] ? $teams[1] : "No team"}</div>
                <br>
                <div class="text-primary-base">{$teams[1] ? getAvgTeamPoints($teams[1]) + " pts" : ""}</div>
            </button>
        <button on:click={()=>{handleDeleteTeamButtonState(3)}} class="indicator grow py-1 basis-1 btn btn-outline rounded-l-none">
            {#if showDeleteTeamButton == 3}
                <span on:click={()=>{deleteTeam(3)}} class="z-50 indicator-item badge badge-secondary h-5 w-5 p-0">X</span>                
            {/if}
            <div>{$teams[2] ? $teams[2] : "No team"}</div>
            <br>
            <div class="text-primary-base">{$teams[2] ? getAvgTeamPoints($teams[2]) + " pts" : ""}</div>
        </button>
    </div>
    <div class="w-full px-6 mb-4">
        <button class="m-0 mt-4 font-bold btn w-full btn-primary hover:bg-primary-base bg-buttons border-buttons" on:click={()=>{analyseAlliance()}} >
            Analyse alliance
        </button> 
    </div>
</main>

<Toast bind:showToast={showMaxTeamToast} message={"Max Teams per Alliance"} />
