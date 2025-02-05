<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import "@carbon/charts-svelte/styles.css"
	import { DonutChart, RadarChart, LineChart, ComboChart } from "@carbon/charts-svelte"

    import { writable } from "svelte/store";
	import { TeamsDB } from "$lib/shared/stores/teamsData";

	import { goto } from "$app/navigation";
    import sessionStore from "$lib/shared/stores/sessionStorageStore";
    import { setupSimpleChartsData, getTeamScoutingData, getTBAData, getStatBoticsData, setupModeChartsData, getAverageDBvalues, setupBarChartDataByMatch } from "$lib/shared/scripts/chartUtilities";


    $: data = $TeamsDB
    console.log(data)

    $: teamSearch = "";
    
    $: autoCompleteTeams = writable([]);

    const teamData = sessionStore("selectedTeamData", {"team": "", "logo": new Image(), "name":"", "winrate":"", "EPA":""});

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
        
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            console.log(getTeamScoutingData(teamSearch))
            rawData.set(getTeamScoutingData(teamSearch));

            $teamData.team = teamSearch

            getStatBoticsData(teamSearch).then((r) => {
                if (r.team == teamSearch){
                    $teamData.winrate = r.winrate
                    $teamData.EPA = r.epa

                }
            })

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



<input type="text" bind:value={teamSearch} placeholder="Team Number" class="bg-red-600" />

{#if $teamData}
    <div class="border-color-5800-1 border-4 rounded-md">Team EPA: {$teamData.EPA}</div>
    <div class="border-color-5800-1 border-4 rounded-md">Winrate: {Math.round($teamData.winrate*100*10)/10}%</div>
    <img src={$teamData.logo.src} alt="Team Logo" />
    <div>{$teamData.name}</div>
    
{/if}
    
{#each $autoCompleteTeams as team}
    <div>
        <button on:click={() => {teamSearch=team.team}}>{team.team}</button>
    </div>
{/each}
    
{#if $rawData.length > 0}
    <div class="border-color-5800-1 border-4 rounded-md">Avg points: {getAverageDBvalues(
        $rawData,
        allPoints,
        true
    )}</div>

    <svelte:component
        this={DonutChart}
        data={setupSimpleChartsData(
            $rawData,
            {
                "Coral" : ["autoROneScore", "autoRTwoScore", "autoRThreeScore", "autoRFourScore","teleopROneScore", "teleopRTwoScore", "teleopRThreeScore", "teleopRFourScore"], 
                "Processor": ["autoProcessorScore", "teleopProcessorScore"], 
                "Net": ["autoNetScore", "teleopNetScore"]
            },
        )}
        options={{
            theme: "g90",
            title: "Game Piece Points",
            height: "200px",
            width: "200px",
            axes: {
                left: { mapsTo: "value" },
                bottom: { mapsTo: "group", scaleType: "labels" }
                }
            }
        }
    /> 

    <svelte:component
        this={DonutChart}
        data={setupSimpleChartsData(
            $rawData,
            {
                "Auto" : ["autoROneScore", "autoRTwoScore", "autoRThreeScore", "autoRFourScore", "autoProcessorScore", "autoNetScore", "isLeave"], 
                "Teleop": ["teleopROneScore", "teleopRTwoScore", "teleopRThreeScore", "teleopRFourScore", "teleopProcessorScore", "teleopNetScore"], 
                "Endgame": ["bargeStatus"]
            },
        )}
        options={{
            theme: "g90",
            title: "Points By Game State",
            height: "200px",
            width: "200px",
            axes: {
                left: { mapsTo: "value" },
                bottom: { mapsTo: "group", scaleType: "labels" }
                }
            }
        }
    />
    <svelte:component
        this={DonutChart}
        data={setupModeChartsData(
            $rawData,
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
            height: "200px",
            width: "200px",
            axes: {
                left: { mapsTo: "value" },
                bottom: { mapsTo: "group", scaleType: "labels" }
                }
            }
        }
    /> 
    <svelte:component
        this={DonutChart}
        data={setupModeChartsData(
            $rawData,
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
            height: "200px",
            width: "200px",
            axes: {
                left: { mapsTo: "value" },
                bottom: { mapsTo: "group", scaleType: "labels" }
                }
            }
        }
    /> 
    {#key $rawData}
        <RadarChart
            data={setupSimpleChartsData(
            $rawData,
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
                $rawData,
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
                height: "400px"
            }}
        />
    {/key}
    <svelte:component
        this={ComboChart}
        data={setupBarChartDataByMatch(
            $rawData,
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
<button class="border-color-5800-1 border-4 rounded-md" on:click={() => {goto("/dataAnalisys/teamAnalisys/pitData")}}>Pit Data</button>
<button class="border-color-5800-1 border-4 rounded-md" on:click={() => {goto("/dataAnalisys/teamAnalisys/Teleop")}}>Teleop Analisys</button>
<button class="border-color-5800-1 border-4 rounded-md" on:click={() => {goto("/dataAnalisys/teamAnalisys/Autonomous")}}>Auto Analisys</button>
<button class="border-color-5800-1 border-4 rounded-md" on:click={() => {goto("/dataAnalisys/teamAnalisys/EndGame")}}>Endgame Analisys</button>