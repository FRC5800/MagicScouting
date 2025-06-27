<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';
    import { _ } from 'svelte-i18n';
    import { App } from '@capacitor/app';
    App.addListener("backButton", () => {goto("/dataAnalisys/teamAnalisys")});

    import { BarChartGrouped, DonutChart, RadarChart, ComboChart } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from '$app/navigation';
    import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";
    import { setupBarChartsData ,setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch } from "$lib/shared/scripts/chartUtilities";


    export let data;
    let teamData = $teamAnalysisData[data.selectedTeam];

    let rawData = writable(getTeamScoutingData(teamData.team));
    console.log(teamData.team)

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

{#if teamData}
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i on:click={()=>{goto("/dataAnalisys/teamAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <div class="grow flex flex-row gap-4 items-center">

            <img width="50px" src={teamData.logo} alt="Team Logo" />
            <div class="flex flex-row gap-2">
                <div>{teamData.team}</div>
                <div>{teamData.name}</div>
            </div>
        </div>
    </div>    
{/if}

<div class="w-full px-6 mb-20 flex flex-col items-center sm:flex-row sm:flex-wrap sm:gap-10 sm:items-center sm:justify-center sm:pt-6">
    
    {#if $rawData.length > 0}
        <div class="w-full flex">
            <div class=" w-full relative mb-2 mx-6 grow">
                <div class="flex flex-row justify-around items-center gap-4">
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>{$_("dataAnalysis.average_points")}</h3>
                        <span class="text-primary-base text-xl">{getAverageDBvalues(
                            $rawData,
                            autoPoints,
                            true
                        )}</span>
                    </div>
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>{$_("dataAnalysis.average_leave")}</h3>
                        <span class="text-primary-base text-xl">{getAverageDBvalues(
                            $rawData,
                            ["isLeave"],
                            true
                        )}</span>
                    </div>
                </div>
            </div>
        </div>

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
            theme: $carbonTheme,
            title: 'CORAL',
            height: '200px',
            width: '320px',
            axes: {
                bottom: { mapsTo: 'value' },
                left: { mapsTo: 'key', scaleType: 'labels' }
                }
            }
        }
        /> 

        <div class="divider"></div>

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
            theme: $carbonTheme,
            title: 'ALGAE',
            height: '200px',
            width: '320px',
            axes: {
                bottom: { mapsTo: 'value' },
                left: { mapsTo: 'key', scaleType: 'labels' }
                }
            }
        }
        /> 

        <div class="divider"></div>
    
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
                    theme: $carbonTheme,
                    title: $_("dataAnalysis.teamAnalysis.scoring_profile"),
                    radar: {
                        axes: {
                            angle: "group",
                            value: "value"
                        }
                    },
                    data: {
                        groupMapsTo: "product"
                    },
                    height: "400px",
                    width: "300px"
                }}
            />
        {/key}

        <div class="divider"></div>

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
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.score_by_match"),
                height: "200px",
                width: "320px",
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
</div>