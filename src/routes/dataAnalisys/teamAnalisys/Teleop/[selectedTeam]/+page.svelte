<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";
    import { carbonTheme } from '$lib/shared/stores/darkMode.js';
    import { _ } from 'svelte-i18n';

    import { BarChartGrouped, DonutChart, RadarChart, ComboChart, LineChart } from '@carbon/charts-svelte'

    import { writable } from 'svelte/store';
    import { TeamsDB } from "$lib/shared/stores/teamsData";
    import { App } from '@capacitor/app';
    App.addListener("backButton", () => {goto("/dataAnalisys/teamAnalisys")});

    import { goto } from '$app/navigation';
    import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";
    import { setupBarChartsData ,setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, getAverageCycleData, setupBarChartDataByMatch, parseCycleString } from "$lib/shared/scripts/chartUtilities";

    import { teleopPoints } from "$lib/shared/stores/gameKeys";

    let { data } = $props();
    let teamData = $teamAnalysisData[data.selectedTeam];

    let rawData = writable(getTeamScoutingData(teamData.teamNumber));
    console.log(teamData.teamNumber)

    console.log($rawData)

    function getAverageClimbTime() {
        if (!$rawData || $rawData.length === 0) return 0;
        const climbTimes = $rawData
            .filter(match => {
                const climb = match.teleopClimb;
                return climb && climb !== 'none' && climb !== '';
            })
            .map(match => Number(match.teleopClimbTime) || 0)
            .filter(time => time > 0);

        if (climbTimes.length === 0) return 0;
        return climbTimes.reduce((sum, time) => sum + time, 0) / climbTimes.length;
    }
    /**
     * Get percentage of matches with passes by bump
     */
    function getPassesByBumpRate() {
        if (!$rawData || $rawData.length === 0) return 0;
        const passCount = $rawData.filter(match => {
            const value = match.passesByBump;
            return value === 'true' || value === true || value === '1';
        }).length;
        return (passCount / $rawData.length) * 100;
    }

    /**
     * Get percentage of matches with passes by trench
     */
    function getPassesByTrenchRate() {
        if (!$rawData || $rawData.length === 0) return 0;
        const passCount = $rawData.filter(match => {
            const value = match.passesByLowBar;
            return value === 'true' || value === true || value === '1';
        }).length;
        return (passCount / $rawData.length) * 100;
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
                            teleopPoints,
                            true
                        )}</span>
                    </div>
                </div>
            </div>
            <div class=" w-full relative mb-2 mx-6 grow">
                <div class="flex flex-row justify-around items-center gap-4">
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>{"Climb Time"}</h3>
                        <span class="text-primary-base text-xl">{Math.round(getAverageClimbTime()*10)/10}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- <BarChartGrouped
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

        <BarChartGrouped
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
        /> -->

        <div class="divider"></div>

        <!-- <LineChart
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
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.cycle_by_match"),
                height: "250px",
                width: "320px",
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
        /> -->


        <DonutChart
        data={setupModeChartsData(
            $rawData,
            "teleopClimb",
            {
                "none": "None",
                "L1": "L1",
                "L2": "L2",
                "L3": "L3"
            },
        )}
        options={{
            theme: $carbonTheme,
            title: "Climb Profile",
            height: "300px",
            width: "300px",
            axes: {
                left: { mapsTo: "value" },
                bottom: { mapsTo: "group", scaleType: "labels" }
                }
            }
        }
        />
        <div class="divider"></div>

        <ComboChart
            data={setupBarChartDataByMatch(
                $rawData,
                {
                    Score: {fields: teleopPoints, valueName: "Points", showPoints: true},
                    Fuel: {fields: ["teleopFuelNumber"], valueName: "Points", showPoints: true},
                    Climb: {fields: ["teleopClimb"], valueName: "Points", showPoints: true}
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
    <div class="divider"></div>

    <div class="overflow-x-auto w-full">
        <table class="table">
            <thead>
                <tr>
                    <th>Match</th>
                    <th>Climb Level</th>
                    <th>Climb Time</th>
                    <th>Passes by Bump</th>
                    <th>Passes by Trench</th>
                </tr>
            </thead>
            <tbody>
                {#key $rawData}
                    {#each $rawData.slice().sort((a,b) => Number(a.matchNumber) - Number(b.matchNumber)) as match}
                        <tr>
                            <th>{match.matchNumber}</th>
                            <td>{match.teleopClimb || 'none'}</td>
                            <td>{match.teleopClimbTime ? Number(match.teleopClimbTime).toFixed(1) + 's' : '-'}</td>
                            <td>{(match.passesByBump === 'true' || match.passesByBump === true || match.passesByBump === '1') ? 'Yes' : 'No'}</td>
                            <td>{(match.passesByLowBar === 'true' || match.passesByLowBar === true || match.passesByLowBar === '1') ? 'Yes' : 'No'}</td>
                        </tr>
                    {/each}
                {/key}
            </tbody>
        </table>
    </div>
</div>
