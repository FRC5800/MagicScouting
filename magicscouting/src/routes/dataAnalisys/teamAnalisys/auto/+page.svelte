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
        import { setupChartsDataScore, getTeamScoutingData, getTBAData } from "$lib/shared/scripts/chartUtilities";
    
    
        // $: data = $TeamsDB
        // console.log(data)
    
        $: teamSearch = "";
        
        $: autoCompleteTeams = writable([]);
    
        const teamData = sessionStore("selectedTeamData", {"logo": new Image(), "name":""});
    
        let debounceTimeout;
    
        let rawData = writable([]);
    
        $: if (teamSearch != "") {
            console.log(teamSearch);
            let alreadyIn = [];
            let filterSugestions = $TeamsDB.filter((entry) => {
                let condition = entry["team"].toString().includes(teamSearch) && entry["team"].toString() != teamSearch && !alreadyIn.includes(entry["team"].toString());
                alreadyIn.push(entry["team"].toString());
                return condition;
            });
    
            autoCompleteTeams.set(filterSugestions);
            
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(async () => {
                console.log(getTeamScoutingData(teamSearch))
                rawData.set(getTeamScoutingData(teamSearch));
    
                getTBAData(teamSearch).then((r) => {
                    if (r.team == teamSearch){
                        $teamData.logo.src = r.logo
                        $teamData.name = r.name
                    }
                });
            }, 300); // Adjust the debounce delay as needed
        } else {
            autoCompleteTeams.set([]);
        }
    
    
    </script>
    
    <input type="text" bind:value={teamSearch} placeholder="Team Number" class="bg-red-600" />
    
    {#if $teamData}
        <img src={$teamData.logo.src} alt="Team Logo" />
        <div>{$teamData.name}</div>
    {/if}
    {#each $autoCompleteTeams as team}
        <div>
            <button on:click={() => {teamSearch=team.team}}>{team.team}</button>
        </div>
    {/each}
    
    <svelte:component
        this={BarChartGrouped}
        data={setupChartsDataScore(
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
        data={setupChartsDataScore(
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
        data={setupChartsDataScore(
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
    
    <button on:click={() => {goto("/dataAnalisys/teamAnalisys/pitData")}}>Pit Data</button>