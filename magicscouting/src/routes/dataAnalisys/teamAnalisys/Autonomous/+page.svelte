<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
    import { BarChartGrouped, DonutChart, RadarChart, ComboChart } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from '$app/navigation';
    import sessionStore from "$lib/shared/stores/teamAnalysisData";
    import { setupBarChartsData ,setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch } from "$lib/shared/scripts/chartUtilities";


    const teamData = sessionStore("selectedTeamData", {"logo": new Image(), "name":""});

    let rawData = writable(getTeamScoutingData($teamData.team));
    console.log($teamData.team)

    console.log($rawData)
    
    let autoPoints = [
        "autoROneScore",
        "autoRTwoScore", 
        "autoRThreeScore", 
        "autoRFourScore", 
        "autoProcessorScore", 
        "autoNetScore", 
        "isLeave"
    ]
    let coralAutoPoints = [
        "autoROneScore",
        "autoRTwoScore", 
        "autoRThreeScore", 
        "autoRFourScore", 
    ]
    let algaeAutoPoints = [
        "autoProcessorScore", 
        "autoNetScore", 
    ]

</script>

{#if $teamData}
    <div class="border-color-5800-1 border-4 rounded-md">Team EPA: {$teamData.EPA}</div>
    <div class="border-color-5800-1 border-4 rounded-md">Winrate: {Math.round($teamData.winrate*100*10)/10}%</div>
    <img src={$teamData.logo.src} alt="Team Logo" />
    <div class="border-color-5800-1 border-4 rounded-md">Team: {$teamData.team}</div>
    <div>{$teamData.name}</div>    
{/if}

<svelte:component
    this={BarChartGrouped}
    data={setupBarChartsData(
        $rawData,
        {
            "L1": "autoROne",
            "L2": "autoRTwo",
            "L3": "autoRThree",
            "L4": "autoRFour",
        }
    )}
    options={{
        theme: 'g90',
        title: 'CORAL',
        height: '200px',
        width: '400px',
        axes: {
            bottom: { mapsTo: 'value' },
            left: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 

    
<svelte:component
    this={BarChartGrouped}
    data={setupBarChartsData(
        $rawData,
        {
            "HIGH": "autoRemoveAlgaeLow",
            "LOW": "autoRemoveAlgaeHigh",
        },
        false,
        [""]
    ).concat(setupBarChartsData(
        $rawData,
        {
        "PROC": ["autoProcessor"],
        "NET": ["autoNet"],
        },
        false
    ))}
    options={{
        theme: 'g90',
        title: 'ALGAE',
        height: '200px',
        width: '400px',
        axes: {
            bottom: { mapsTo: 'value' },
            left: { mapsTo: 'key', scaleType: 'labels' }
            }
        }
    }
/> 

    
{#if $rawData.length > 0}
    <div class="border-color-5800-1 border-4 rounded-md">Avg auto points: {getAverageDBvalues(
        $rawData,
        autoPoints,
        true
    )}</div>
    <div class="border-color-5800-1 border-4 rounded-md">Avg leave: {getAverageDBvalues(
        $rawData,
        ["isLeave"],
        true
    )}</div>
 
    {#key $rawData}
        <RadarChart
            data={setupSimpleChartsData(
            $rawData,
                {
                    "L1" : ["autoROneScore"], 
                    "L2" : ["autoRTwoScore"], 
                    "L3" : ["autoRThreeScore"], 
                    "L4" : ["autoRFourScore"],
                    "Proc" : ["autoProcessorScore"],
                    "Net": ["autoNetScore"] 
                },
                "radar"
            ).concat(setupSimpleChartsData(
                $rawData,
                {
                    "L1" : ["autoROneScore"], 
                    "L2" : ["autoRTwoScore"], 
                    "L3" : ["autoRThreeScore"], 
                    "L4" : ["autoRFourScore"],
                    "Proc" : ["autoProcessorScore"],
                    "Net": ["autoNetScore"] 
                },
                "radar",
                true
            ))}
            options={{
                title: "Scoring profile",
                radar: {
                    axes: {
                        angle: "group",
                        value: "value"
                    }
                },
                data: {
                    groupMapsTo: "product"
                },
                height: "400px"
            }}
        />
    {/key}
    <svelte:component
        this={ComboChart}
        data={setupBarChartDataByMatch(
            $rawData,
            {
                Score: {fields: autoPoints, valueName: "Points", showPoints: true},
                Coral: {fields: coralAutoPoints, valueName: "GPs", showPoints: false},
                Algae: {fields: algaeAutoPoints, valueName: "GPs", showPoints: false}
            },
            
        )}
        options={{
            theme: "g90",
            title: "Avg score by match",
            height: "200px",
            width: "400px",
            comboChartTypes:[
                {
                    type: "grouped-bar",
                    correspondingDatasets: [
                        "Coral",
                        "Algae"
                    ]
                },
                {
                    type: "line",
                    correspondingDatasets:[
                        "Score"
                    ]
                }
            ],
            axes: {
                    left: {
                        title: "Score",
                        mapsTo: "Points"                        
                    },
                    bottom: {
                        scaleType: "labels",
                        title: "Match",
                        mapsTo: "key",
                    },
                    right: {
                        title: "Game Pieces",
                        scaleType: "linear",
                        mapsTo: "GPs",
                        correspondingDatasets: [
                            "Coral",
                            "Algae"
                        ]
                    }
                }
            }
        }
    />
{/if}


<button on:click={() => {goto("/dataAnalisys/teamAnalisys")}}>Team Analisys</button>