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

    import { autoPoints } from "$lib/shared/stores/gameKeys.js";

    let { data } = $props();
    let teamData = $teamAnalysisData[data.selectedTeam];

    let rawData = writable(getTeamScoutingData(teamData.teamNumber));
    console.log(teamData.teamNumber)

    console.log($rawData)

    function getAverageClimbTime() {
        if (!$rawData || $rawData.length === 0) return 0;
        const climbTimes = $rawData
            .filter(match => {
                const climb = match.autoClimb;
                return climb && climb !== 'none' && climb !== '';
            })
            .map(match => Number(match.autoClimbTime) || 0)
            .filter(time => time > 0);

        if (climbTimes.length === 0) return 0;
        return climbTimes.reduce((sum, time) => sum + time, 0) / climbTimes.length;
    }



</script>

{#if teamData}
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i onclick={()=>{goto("/dataAnalisys/teamAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <div class="grow flex flex-row gap-4 items-center">

            <img width="50px" src={teamData.logo} alt="Team Logo" />
            <div class="flex flex-row gap-2">
                <div>{teamData.teamNumber}</div>
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
                </div>
            </div>
            <div class=" w-full relative mb-2 mx-6 grow">
                <div class="flex flex-row justify-around items-center gap-4">
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>{"Avg climb time"}</h3>
                        <span class="text-primary-base text-xl">{Math.round(getAverageClimbTime()*10)/10}</span>
                    </div>
                </div>
            </div>
        </div>


        <div class="divider"></div>

        <ComboChart
            data={setupBarChartDataByMatch(
                $rawData,
                {
                    Score: {fields: autoPoints, valueName: "Points", showPoints: true},
                    Fuel: {fields: ["autoFuelNumber"], valueName: "Points", showPoints: true},
                    Climb: {fields: ["autoClimb"], valueName: "Points", showPoints: true}
                }
                )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.score_by_match"),
                height: "200px",
                width: "330px",
                comboChartTypes:[
                    {
                        type: "grouped-bar",
                        correspondingDatasets: [
                            "Climb",
                            "Fuel",
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
                        // right: {
                        //     title: "Game Pieces",
                        //     scaleType: "linear",
                        //     mapsTo: "Points",
                        //     correspondingDatasets: [
                        //         "Fuel",
                        //         "Climb"
                        //     ]
                        // }
                    }
                }
            }
        />
    {/if}
</div>
