<script>
// @ts-nocheck

	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { BarChartStacked, BarChartGrouped } from '@carbon/charts-svelte'

    import { goto } from "$app/navigation";

    import SyncData from "$lib/components/SyncDataButton.svelte";
    import SyncDataButton from "$lib/components/SyncDataButton.svelte";

	import { TeamsDB, PitTeamsDB, MatchSchema, PitSchema } from "$lib/shared/stores/teamsData";

    import { avgTeamPerformance, getSortedTeams } from "$lib/shared/scripts/chartUtilities";
	import { writable } from "svelte/store";

    let leaderboardData = writable([]);
    onMount(async () => {
        if (localStorage.getItem("MatchSchema") == "Not assigned" || localStorage.getItem("PitSchema") == "Not assigned"){
            SyncData();
        }
        leaderboardData.set(avgTeamPerformance(getSortedTeams($TeamsDB)))
        console.log($leaderboardData)
    })

    
</script>

<SyncDataButton />

{#if $leaderboardData.length > 0}
    <svelte:component
        this={BarChartStacked}
        data={$leaderboardData}
        options={{
            theme: 'g90',
            title: 'Leaderboard',
            height: '500px',
            width: '70%',
            axes: {
                bottom: { mapsTo: 'value', scaleType: "linear"},
                left: { mapsTo: 'key', scaleType: 'labels' }
                }
            }
        }
    /> 
{/if}
<button on:click={() => {goto('/dataAnalisys/teamAnalisys')}}>Team Analisys</button>

