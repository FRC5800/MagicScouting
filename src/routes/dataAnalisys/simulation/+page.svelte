<script>
    // @ts-nocheck
    
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";

    import { _ } from 'svelte-i18n';
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';
	import { App } from '@capacitor/app';
    App.addListener("backButton", () => {goto("/dataAnalisys")});

    import { DonutChart, RadarChart, LineChart, ComboChart, BarChartSimple, BarChartGrouped } from "@carbon/charts-svelte"

    import { writable } from "svelte/store";
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from "$app/navigation";
    import simulationData from "$lib/shared/stores/simulationData";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch, getDefaultLogo, setupAllianceChartData, avgArray } from "$lib/shared/scripts/chartUtilities";
    import TeamSearchBar from "$lib/components/TeamSearchBar.svelte";
	import Toast from "$lib/components/Toast.svelte";
    import { allPoints, autoPoints, teleopPoints, algaePoints, coralPoints } from "$lib/shared/scripts/points";
	import AllianceSelector from "$lib/components/AllianceSelector.svelte";
	
	$: winPredict = predictMatch()

	function getAllianceTeams(alliance){
		if (alliance == "alliance1"){
			return Object.keys($simulationData["alliance1"])
		}else{
			return Object.keys($simulationData["alliance2"])
		}
	}

    function getAvgTeamPoints(team){
        return getAverageDBvalues(
                $simulationData[team].rawData,
                allPoints,
                true
            )
    }

    function getAvgAlliancePoints(alliance, fields){
		let total = 0;
		
        let allianceTeams = getAllianceTeams(alliance)

		if (allianceTeams.length == 0) return total

        allianceTeams.forEach(team => {
            total += getAverageDBvalues(
                $simulationData[alliance][team].rawData,
                fields,
                true
            )
        });
        return total
    }

	
    let lookupFields = {
        "Auto": autoPoints,
        "Teleop": teleopPoints,
		"Endgame": ["bargeStatus"],
        "Coral": coralPoints,
        "Algae": algaePoints,
        "Total": allPoints
    }

	let titleLookup = {
		"alliance1": "Alliance 1",
		"alliance2": "Alliance 2"
	}
	
	function getAllianceAvgWinrate(alliance){
		let winrates = []
		getAllianceTeams(alliance).forEach((team) => {
			let team_winrate = $simulationData[alliance][team].winrate
			console.log(team_winrate)
		
			winrates.push(!isNaN(team_winrate) && team_winrate ? team_winrate : 0.5)
		})
		console.log(winrates)
		return avgArray(winrates)
	}

	function predictMatch(){
		let certainty = 0.95


		let alliance1_score = getAvgAlliancePoints("alliance1", allPoints)
		let alliance2_score = getAvgAlliancePoints("alliance2", allPoints)

		let alliance1_average_winrate = getAllianceAvgWinrate("alliance1")
		let alliance2_average_winrate = getAllianceAvgWinrate("alliance2")

		let winrate_diff = alliance1_average_winrate - alliance2_average_winrate

		let norm_diff = (alliance1_score - alliance2_score)/(alliance1_score+alliance2_score)
		
		let uncertain_win_prob = ( 1/(1 + 10**((norm_diff*0.8 + winrate_diff*0.2 )*-4)) )

		let certain_win_prob = uncertain_win_prob * certainty + (1-certainty)/2

		return Math.round(certain_win_prob*100)
	}

	$: console.log($simulationData)
	$: $simulationData, console.log(`Alliance 1 average: ${getAvgAlliancePoints("alliance1", allPoints)}`)
	$: $simulationData, console.log(`Alliance 2 average: ${getAvgAlliancePoints("alliance2", allPoints)}`)
	$: $simulationData, winPredict = predictMatch()
	$: $simulationData, console.log(winPredict)

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white mb-16">
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i on:click={()=>{goto("/dataAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <h1 class="grow flex flex-row items-center text-2xl font-medium tracking-wide">{$_("dataAnalysis.simulation.title")}</h1>
    </div>

   <AllianceSelector 
        bind:simulationData={$simulationData} 
        dataStore="alliance1" 
		title = "Alliance 1"/>
    <AllianceSelector 
        bind:simulationData={$simulationData} 
        dataStore="alliance2" 
		title = "Alliance 2"/>

		{#if Object.keys($simulationData["alliance1"]).length > 0 && Object.keys($simulationData["alliance2"]).length > 0}
			<section class="flex flex-col justify-center items-center w-full bg-[#f0f0f0] dark:bg-base-200 px-6 pb-10">
				
				{#key $simulationData}
					{#each ["alliance1", "alliance2"] as alliance }
						<div class="w-full flex items-center justify-center mt-4">
							<div class="w-full relative my-2 mx-6 grow flex items-center flex-col">
		
								
								{#if winPredict > 0.5 && alliance == "alliance1" || winPredict < 0.5 && alliance == "alliance2"}
									<h2 class="text-xl font-medium tracking-wide mb-2">{$_("dataAnalysis.simulation.winner")}!</h2>
								{/if}
		
								{#if winPredict == 0.5}
									<h2 class="text-xl font-medium tracking-wide mb-2">{$_("dataAnalysis.simulation.tie")}!</h2>
								{/if}
								
								<h2 class="text-xl font-medium tracking-wide mb-2">{$_("dataAnalysis.simulation.win_chance")}: {winPredict == NaN ? "" : Math.abs((alliance == "alliance1"? 0 : 100) - winPredict)}%</h2>
								
		
								<h2 class="text-xl font-medium tracking-wide mb-2">{$_("dataAnalysis.matchAnalysis.points_subtitle")}</h2>
								<div class="flex flex-row justify-around items-center flex-wrap">
									{#each Object.keys(lookupFields) as field}
										<div class="grow-[2] basis-0 p-4 py-2 rounded-md flex flex-col items-center justify-center gap-2">
											<h3>{field}</h3>
											<span class="text-primary-base text-xl">{getAvgAlliancePoints(alliance, lookupFields[field])}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				{/key}
		
			</section> 
		{/if}
</main>
