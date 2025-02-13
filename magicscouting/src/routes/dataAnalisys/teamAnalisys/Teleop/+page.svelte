<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
    import { BarChartGrouped, DonutChart, RadarChart, ComboChart, LineChart } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from '$app/navigation';
    import sessionStore from "$lib/shared/stores/teamAnalysisData";
    import { setupBarChartsData ,setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, getAverageCycleData, setupBarChartDataByMatch, parseCycleString } from "$lib/shared/scripts/chartUtilities";


    const teamData = sessionStore("selectedTeamData", {"logo": new Image(), "name":""});

    let rawData = writable(getTeamScoutingData($teamData.team));
    console.log($teamData.team)

    console.log($rawData)
    
    let teleopPoints = [
        "teleopROneScore",
        "teleopRTwoScore", 
        "teleopRThreeScore", 
        "teleopRFourScore", 
        "teleopProcessorScore", 
        "teleopNetScore", 
    ]
    let coralTeleopPoints = [
        "teleopROneScore",
        "teleopRTwoScore", 
        "teleopRThreeScore", 
        "teleopRFourScore", 
    ]
    let algaeTeleopPoints = [
        "teleopProcessorScore", 
        "teleopNetScore", 
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
            "L1": "teleopROne",
            "L2": "teleopRTwo",
            "L3": "teleopRThree",
            "L4": "teleopRFour",
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
            "HIGH": "teleopRemoveAlgaeLow",
            "LOW": "teleopRemoveAlgaeHigh",
        },
        false,
        [""]
    ).concat(setupBarChartsData(
        $rawData,
        {
        "PROC": ["teleopProcessor"],
        "NET": ["teleopNet"],
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
    <div class="border-color-5800-1 border-4 rounded-md">Avg teleop points: {getAverageDBvalues(
        $rawData,
        teleopPoints,
        true
    )}</div>
    <div class="border-color-5800-1 border-4 rounded-md">Avg cycle time: {getAverageCycleData(
        $rawData,
        [
            "coralStationCycleTime",
            "coralFloorCycleTime",
            "algaeCycleTime"
        ],
    )} s</div>

    {#key $rawData}
        <RadarChart
            data={setupSimpleChartsData(
            $rawData,
                {
                    "L1" : ["teleopROneScore"], 
                    "L2" : ["teleopRTwoScore"], 
                    "L3" : ["teleopRThreeScore"], 
                    "L4" : ["teleopRFourScore"],
                    "Proc" : ["teleopProcessorScore"],
                    "Net": ["teleopNetScore"] 
                },
                "radar"
            ).concat(setupSimpleChartsData(
                $rawData,
                {
                    "L1" : ["teleopROneScore"], 
                    "L2" : ["teleopRTwoScore"], 
                    "L3" : ["teleopRThreeScore"], 
                    "L4" : ["teleopRFourScore"],
                    "Proc" : ["teleopProcessorScore"],
                    "Net": ["teleopNetScore"] 
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
        this={LineChart}
        data={setupBarChartDataByMatch(
            $rawData,
            {
                CoralStation: {fields: ["coralStationCycleTime"], valueName: "Seconds", showPoints: false},
                CoralFloor: {fields: ["coralFloorCycleTime"], valueName: "Seconds", showPoints: false},
                Algae: {fields: ["algaeCycleTime"], valueName: "Seconds", showPoints: false}
            },
            parseCycleString
        )}
        options={{
            theme: "g90",
            title: "Avg Cycle time by match",
            height: "200px",
            width: "400px",
            axes: {
                    left: {
                        title: "Seconds",
                        mapsTo: "Seconds"                        
                    },
                    bottom: {
                        scaleType: "labels",
                        title: "Match",
                        mapsTo: "key",
                    },
                }
            }
        }
    />
    
    <svelte:component
        this={ComboChart}
        data={setupBarChartDataByMatch(
            $rawData,
            {
                Score: {fields: teleopPoints, valueName: "Points", showPoints: true},
                Coral: {fields: coralTeleopPoints, valueName: "GPs", showPoints: false},
                Algae: {fields: algaeTeleopPoints, valueName: "GPs", showPoints: false}
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