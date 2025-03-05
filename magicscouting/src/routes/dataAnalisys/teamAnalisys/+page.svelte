<script>
    // @ts-nocheck
    
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import { onMount } from "svelte";
    import { _ } from 'svelte-i18n';

    import { carbonTheme } from '$lib/shared/stores/darkMode.js';

    import { DonutChart, RadarChart, LineChart, ComboChart } from "@carbon/charts-svelte"

    import { writable } from "svelte/store";
    import { TeamsDB } from "$lib/shared/stores/teamsData";

    import { goto } from "$app/navigation";
    import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch, getDefaultLogo } from "$lib/shared/scripts/chartUtilities";
    import TeamSearchBar from "$lib/components/TeamSearchBar.svelte";
    import { allPoints, coralPoints, algaePoints } from "$lib/shared/scripts/points";


    $: data = $TeamsDB
    console.log(data)

    $: teamSearch = "";
    $: selectedTeam = "";
    $: activeTab = Object.keys($teamAnalysisData)[0] ?? "";
    
    $: autoCompleteTeams = writable([]);

    $: console.log($teamAnalysisData)

    let debounceTimeout;
    
    function handleTabClose(teamNumber){
        delete $teamAnalysisData[teamNumber];
        $teamAnalysisData = $teamAnalysisData;
        activeTab = ""
        if (Object.keys($teamAnalysisData).length > 0){
            activeTab = Object.keys($teamAnalysisData)[0];
        }
        console.log($teamAnalysisData);
    }
    
    </script>
    
    <main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white mb-16">
        <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
            <i on:click={()=>{goto("/dataAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
            <h1 class="grow flex flex-row items-center text-2xl font-medium tracking-wide">{$_("dataAnalysis.teamAnalysis.title")}</h1>
        </div>
    
        <div class="w-full flex gap-4 mb-4 px-6 flex-col items-start">
            <h2 class="text-xl font-medium tracking-wide">{$_("dataAnalysis.teamAnalysis.searchBar_text")}</h2>
            <TeamSearchBar {teamSearch} bind:selectedTeam={selectedTeam} bind:analysisData={$teamAnalysisData}/>
        </div>
        <div class="w-full flex">
            <div role="tablist" class="tabs tabs-lifted  overflow-x-scroll">
                {#key $teamAnalysisData}
                    {#each Object.keys($teamAnalysisData) as teamNumber (Object.keys($teamAnalysisData))}
                        <span role="tab" class="tab {activeTab==teamNumber ? "tab-active" : ""} flex flex-row gap-2 justify-center items-center min-w-max">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <span on:click={()=>{activeTab=teamNumber}}>{teamNumber}</span>
                            {#if activeTab==teamNumber}                            
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <i on:click={()=>{handleTabClose(teamNumber)}} class="fi fi-rr-cross-small flex"></i> 
                            {/if}
                        </span>           
                    {/each}
                {/key}
            </div>
        </div>

        {#if Object.keys($teamAnalysisData).length != 0 && activeTab != ""}
            <section class="flex flex-col justify-center items-center w-full bg-[#f0f0f0] dark:bg-base-200 px-6 pb-6">
                <div class="flex flex-row gap-4 items-center justify-center mt-6">
                    <img width="50px" src={$teamAnalysisData[activeTab].logo} alt="Team Logo" />
                    <div class="flex flex-row gap-2">
                        <div>{$teamAnalysisData[activeTab].team}</div>
                        <div>{$teamAnalysisData[activeTab].name}</div>
                    </div>
                </div>
                <div class="w-full flex">
                    <div class=" w-full relative my-2 mx-6 grow">
                        <div class="flex flex-row justify-around items-center gap-4">
                            <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                                <h3>{$_("dataAnalysis.teamAnalysis.team_epa")}</h3>
                                <span class="text-primary-base text-xl">{$teamAnalysisData[activeTab].EPA}</span>
                            </div>
                            <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                                <h3>{$_("dataAnalysis.teamAnalysis.team_winrate")}</h3>
                                <span class="text-primary-base text-xl">{Math.round($teamAnalysisData[activeTab].winrate*100*10)/10}%</span>
                            </div>
                        </div>
                    </div>
                </div>
    
                {#if $teamAnalysisData[activeTab].rawData.length > 0}
                    <div class="w-full flex mb-3">
                        <div class=" w-full relative my-2 mx-6 grow">
                            <div class="grow basis-0 rounded-md flex flex-col items-center justify-center gap-2">
                                <h3>{$_("dataAnalysis.teamAnalysis.average_points")}</h3>
                                <span class="text-primary-base text-xl">{getAverageDBvalues(
                                    $teamAnalysisData[activeTab].rawData,
                                    allPoints,
                                    true
                                )}</span>
                            </div>
                        </div>
                    </div>
    
                    <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
                        <h2 class="text-xl font-medium tracking-wide">{$_("dataAnalysis.teamAnalysis.analytics_subtitle")}</h2>
                        
                        <div class="w-full flex flex-col gap-2 ">
                            <button on:click={() => {goto(`/dataAnalisys/teamAnalisys/pitData/${activeTab}`)}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                                <i class="fi fi-rr-bank"></i>
                                <span>{$_("dataAnalysis.teamAnalysis.pit_data")}</span>
                                <div class="flex items-center justify-end grow">
                                    <i class="fi fi-rr-angle-right flex"></i>
                                </div>
                            </button>
                            <button on:click={() => {goto(`/dataAnalisys/teamAnalisys/Teleop/${activeTab}`)}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                                <i class="fi fi-rr-users-alt flex"></i>
                                <span>{$_("dataAnalysis.teamAnalysis.teleop_analytics")}</span>
                                <div class="flex items-center justify-end grow">
                                    <i class="fi fi-rr-angle-right flex"></i>
                                </div>
                            </button>
                            <button on:click={() => {goto(`/dataAnalisys/teamAnalisys/Autonomous/${activeTab}`)}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                                <i class="fi fi-rr-overview flex"></i>
                                <span>{$_("dataAnalysis.teamAnalysis.auto_analytics")}</span>
                                <div class="flex items-center justify-end grow">
                                    <i class="fi fi-rr-angle-right flex"></i>
                                </div>
                            </button>
                            <button on:click={() => {goto(`/dataAnalisys/teamAnalisys/EndGame/${activeTab}`)}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                                <i class="fi fi-rr-hourglass-end"></i>
                                <span>{$_("dataAnalysis.teamAnalysis.endgame_analytics")}</span>
                                <div class="flex items-center justify-end grow">
                                    <i class="fi fi-rr-angle-right flex"></i>
                                </div>
                            </button>
                        </div>   
                    </div>         
    
        <svelte:component
            this={DonutChart}
            data={setupSimpleChartsData(
                $teamAnalysisData[activeTab].rawData,
                {
                    "Coral" : ["autoROneScore", "autoRTwoScore", "autoRThreeScore", "autoRFourScore","teleopROneScore", "teleopRTwoScore", "teleopRThreeScore", "teleopRFourScore"], 
                    "Processor": ["autoProcessorScore", "teleopProcessorScore"], 
                    "Net": ["autoNetScore", "teleopNetScore"]
                },
            )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.gp_points"),
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
    
        <svelte:component
            this={DonutChart}
            data={setupSimpleChartsData(
                $teamAnalysisData[activeTab].rawData,
                {
                    "Auto" : ["autoROneScore", "autoRTwoScore", "autoRThreeScore", "autoRFourScore", "autoProcessorScore", "autoNetScore", "isLeave"], 
                    "Teleop": ["teleopROneScore", "teleopRTwoScore", "teleopRThreeScore", "teleopRFourScore", "teleopProcessorScore", "teleopNetScore"], 
                    "Endgame": ["bargeStatus"]
                },
            )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.points_by_period"),
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
        <svelte:component
            this={DonutChart}
            data={setupModeChartsData(
                $teamAnalysisData[activeTab].rawData,
                "robotFunction",
                {
                    "atk": "Attack",
                    "def": "Defense",
                    "sup": "Support" 
                },
            )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.team_function"),
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
        <svelte:component
            this={DonutChart}
            data={setupModeChartsData(
                $teamAnalysisData[activeTab].rawData,
                "bargeStatus",
                {
                    "none": "None",
                    "park": "Park",
                    "deep": "Deep",
                    "shallow": "Shallow" 
                },
            )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.barge_profile"),
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
        {#key $teamAnalysisData[activeTab].rawData}
            <RadarChart
                data={setupSimpleChartsData(
                $teamAnalysisData[activeTab].rawData,
                    {
                        "L1" : ["autoROneScore", "teleopROneScore"], 
                        "L2" : ["autoRTwoScore", "teleopRTwoScore"], 
                        "L3" : ["autoRThreeScore", "teleopRThreeScore"], 
                        "L4" : ["autoRFourScore", "teleopRFourScore"],
                        "Proc" : ["teleopProcessorScore", "autoProcessorScore"],
                        "Net": ["teleopNetScore", "autoNetScore"] 
                    },
                    "radar"
                ).concat(setupSimpleChartsData(
                    $teamAnalysisData[activeTab].rawData,
                    {
                        "L1" : ["autoROneScore", "teleopROneScore"], 
                        "L2" : ["autoRTwoScore", "teleopRTwoScore"], 
                        "L3" : ["autoRThreeScore", "teleopRThreeScore"], 
                        "L4" : ["autoRFourScore", "teleopRFourScore"],
                        "Proc" : ["teleopProcessorScore", "autoProcessorScore"],
                        "Net": ["teleopNetScore", "autoNetScore"] 
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
                $teamAnalysisData[activeTab].rawData,
                {
                    Score: {fields: allPoints, valueName: "Points", showPoints: true},
                    Coral: {fields: coralPoints, valueName: "GPs", showPoints: false},
                    Algae: {fields: algaePoints, valueName: "GPs", showPoints: false}
                }
            )}
            options={{
                theme: $carbonTheme,
                title: $_("dataAnalysis.teamAnalysis.score_by_match"),
                height: "200px",
                width: "350px",
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
    
            </section>
        {/if}
        
    </main>