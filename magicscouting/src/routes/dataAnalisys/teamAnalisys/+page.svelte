<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import "@carbon/charts-svelte/styles.css"
	import { DonutChart, RadarChart, LineChart, ComboChart } from "@carbon/charts-svelte"

    import { writable } from "svelte/store";
	import { TeamsDB } from "$lib/shared/stores/teamsData";

	import { goto } from "$app/navigation";
    import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch } from "$lib/shared/scripts/chartUtilities";


    $: data = $TeamsDB
    console.log(data)

    $: teamSearch = "";
    $: selectedTeam = "";
    let activeTab = 0

    function search(){
        selectedTeam = teamSearch
        teamSearch = ""
        createTeam()
    }
    
    $: autoCompleteTeams = writable([]);

    $: console.log($teamAnalysisData)

    let debounceTimeout;

    let rawData = writable([]);

    $: if (teamSearch != "") {
        console.log(teamSearch);
        let alreadyIn = [];
        let filterSugestions = data.filter((entry) => {
            let condition = entry["team"].toString().includes(teamSearch) && entry["team"].toString() != teamSearch && !alreadyIn.includes(entry["team"].toString());
            alreadyIn.push(entry["team"].toString());
            return condition;
        });

        autoCompleteTeams.set(filterSugestions);
        
    } else {
        autoCompleteTeams.set([]);
    }
    async function createTeam(){
        console.log(getTeamScoutingData(selectedTeam))
        rawData.set(getTeamScoutingData(selectedTeam));
        let logo = new Image()
        let team = ""
        let epa = ""
        let winrate = ""
        let name = ""
        
        await getStatBoticsData(selectedTeam).then((r) => {
            if (r.team == selectedTeam){
                console.log(r)
                winrate = r.winrate
                epa = r.epa

            }
        })

        await getTBAData(selectedTeam).then((r) => {
            if (r.team == selectedTeam){
                logo = r.logo
                name = r.name
            }
        });

        $teamAnalysisData = [...$teamAnalysisData, {
            "team": selectedTeam, "logo": logo, "name": name, "winrate": winrate, "EPA": epa, "rawData": getTeamScoutingData(selectedTeam)
        }]
    }

    let allPoints = [
        "autoROneScore",
        "autoRTwoScore",
        "autoRThreeScore",
        "autoRFourScore",
        "autoProcessorScore",
        "autoNetScore",
        "isLeave",
        "teleopROneScore",
        "teleopRTwoScore",
        "teleopRThreeScore",
        "teleopRFourScore",
        "teleopProcessorScore",
        "teleopNetScore",
        "bargeStatus"
    ];

    let coralPoints = [
        "autoROneScore",
        "autoRTwoScore",
        "autoRThreeScore",
        "autoRFourScore",
        "teleopROneScore",
        "teleopRTwoScore",
        "teleopRThreeScore",
        "teleopRFourScore",
    ];
    let algaePoints = [
        "autoProcessorScore",
        "autoNetScore",
        "teleopProcessorScore",
        "teleopNetScore",
    ];

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex gap-4 mt-6 mb-6 flex-col items-center">
        <h1 class="text-2xl font-medium tracking-wide">Dashboard</h1>
    </div>

    <div class="w-full flex gap-4 mb-4 px-6 flex-col items-start">
        <h2 class="text-xl font-medium tracking-wide">Search for a team</h2>
        <div class="w-full flex justify-start items-center input input-bordered gap-4 text-base">
            <i class="fi fi-rs-search flex"></i>
            <input class="grow" type="search" name="search" on:keydown={(e)=>{if(e.key == "Enter") search()}} bind:value={teamSearch} placeholder="Team Number" />
        </div>
    </div>
    <div class="w-full flex ">
        <div role="tablist" class="tabs tabs-lifted">
            {#key $teamAnalysisData}
                {#each $teamAnalysisData as team, index}
                    <a on:click={()=>{activeTab=index}} role="tab" class="tab {activeTab==index ? "tab-active" : ""}">{team.team}</a>            
                {/each}
            {/key}
        </div>
    </div>

    {#if $autoCompleteTeams.length > 0}    
        <div class="w-full flex justify-start items-start">
            <div class="menu rounded-md text-base bg-base-200 min-w-fit w-2/5">
                {#each $autoCompleteTeams as team}
                <li>
                    <button on:click={() => {teamSearch=team.team; search()}}>{team.team}</button>
                </li>
                {/each}
            </div>
        </div>  
    {/if}

    {#if $teamAnalysisData.length != 0 && $teamAnalysisData[activeTab].team != ""}
        <section class="flex flex-col justify-center items-center w-full bg-[#f0f0f0] dark:bg-base-200 px-6">
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
                            <h3>Team EPA</h3>
                            <span class="text-primary-base text-xl">{$teamAnalysisData[activeTab].EPA}</span>
                        </div>
                        <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                            <h3>Winrate</h3>
                            <span class="text-primary-base text-xl">{Math.round($teamAnalysisData[activeTab].winrate*100*10)/10}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {#if $teamAnalysisData[activeTab].rawData.length > 0}
                <div class="w-full flex mb-3">
                    <div class=" w-full relative my-2 mx-6 grow">
                        <div class="grow basis-0 rounded-md flex flex-col items-center justify-center gap-2">
                            <h3>Average points</h3>
                            <span class="text-primary-base text-xl">{getAverageDBvalues(
                                $teamAnalysisData[activeTab].rawData,
                                allPoints,
                                true
                            )}</span>
                        </div>
                    </div>
                </div>

                <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
                    <h2 class="text-xl font-medium tracking-wide">Specific Analytics</h2>
                    
                    <div class="w-full flex flex-col gap-2 ">
                        <button on:click={() => {goto("/dataAnalisys/teamAnalisys/pitData")}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                            <i class="fi fi-rr-bank"></i>
                            <span>Pit Data</span>
                            <div class="flex items-center justify-end grow">
                                <i class="fi fi-rr-angle-right flex"></i>
                            </div>
                        </button>
                        <button on:click={() => {goto("/dataAnalisys/teamAnalisys/Teleop")}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                            <i class="fi fi-rr-users-alt flex"></i>
                            <span>Teleop Analitics</span>
                            <div class="flex items-center justify-end grow">
                                <i class="fi fi-rr-angle-right flex"></i>
                            </div>
                        </button>
                        <button on:click={() => {goto("/dataAnalisys/teamAnalisys/Autonomous")}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                            <i class="fi fi-rr-overview flex"></i>
                            <span>Auto Analytics</span>
                            <div class="flex items-center justify-end grow">
                                <i class="fi fi-rr-angle-right flex"></i>
                            </div>
                        </button>
                        <button on:click={() => {goto("/dataAnalisys/teamAnalisys/EndGame")}} class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light">
                            <i class="fi fi-rr-hourglass-end"></i>
                            <span>Endgame Analytics</span>
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
            theme: "g90",
            title: "Game Piece Points",
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
            theme: "g90",
            title: "Points By Game State",
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
            theme: "g90",
            title: "Robot Function",
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
            theme: "g90",
            title: "Barge profile",
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
            theme: "g90",
            title: "Avg score by match",
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