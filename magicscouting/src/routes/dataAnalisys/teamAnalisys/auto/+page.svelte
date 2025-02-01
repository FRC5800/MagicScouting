<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
    import { BarChartGrouped } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from '$app/navigation';
    import sessionStore from "$lib/shared/stores/sessionStorageStore";
    import { setupBarChartsData, getTeamScoutingData, getTBAData } from "$lib/shared/scripts/chartUtilities";


    const teamData = sessionStore("selectedTeamData", {"logo": new Image(), "name":""});

    let rawData = writable(getTeamScoutingData(teamData.team));
    
</script>

{#if $teamData}
    <div class="border-color-5800-1 border-4 rounded-md">Team: {$teamData.team}</div>
    <img src={$teamData.logo.src} alt="Team Logo" />
    <div>{$teamData.name}</div>
{/if}

<svelte:component
    this={BarChartGrouped}
    data={setupBarChartsData(
        $rawData,
        ["L1", "L2", "L3", "L4"],
        ["autoROne", "autoRTwo", "autoRThree", "autoRFour"],
    )}
    options={{
        theme: 'g90',
        title: 'AUTO CORAL',
        height: '200px',
        width: '400px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 

    
<svelte:component
    this={BarChartGrouped}
    data={setupBarChartsData(
        $rawData,
        ["L1", "L2", "L3", "L4"],
        ["autoROne", "autoRTwo", "autoRThree", "autoRFour"],
    )}
    options={{
        theme: 'g90',
        title: 'AUTO CORAL',
        height: '200px',
        width: '400px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 
<svelte:component
    this={BarChartGrouped}
    data={setupBarChartsData(
        $rawData,
        ["L1", "L2", "L3", "L4"],
        ["teleopROne", "teleopRTwo", "teleopRThree", "teleopRFour"]
    )}
    options={{
        theme: 'g90',
        title: 'TELEOP CORAL',
        height: '200px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 

<svelte:component
    this={BarChartGrouped}
    data={setupBarChartsData(
        $rawData,
        ["Auto Processor", "Auto Net", "Teleop Processor", "Teleop Net"],
        ["autoProcessor", "autoNet", "teleopProcessor", "teleopNet"],
    )
    }
    options={{
        theme: 'g90',
        title: 'ALGAE',
        height: '200px',
        axes: {
            left: { mapsTo: 'value' },
            bottom: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 

<button on:click={() => {goto("/dataAnalisys/teamAnalisys")}}>Pit Data</button>