<script>
    // @ts-nocheck
    import { TeamsDB } from "$lib/shared/stores/teamsData";
    import { _ } from 'svelte-i18n';
    import { goto } from "$app/navigation";
    import { averageTeamPerformance, getSortedTeams, getAverageDBvalues, getTeamScoutingData, getAverageCycleData, validateLocalData, avgArray } from "$lib/shared/scripts/chartUtilities";
    import { allPoints, autoPoints, teleopPoints, allMisses } from "$lib/shared/scripts/points";
    import { App } from '@capacitor/app';
    App.addListener("backButton", () => {goto("/dataAnalisys")});

    let allTeams = getSortedTeams($TeamsDB); 
    console.log($TeamsDB)
    let displayFilter = "all";

    let teamsData = [];

    $: if(displayFilter == "all"){
        createAllTable();
    } else if(displayFilter == "auto"){
        createAutoTable();
    } else if(displayFilter == "teleop"){
        createTeleopTable();
    } else {
        createEndgameTable();
    }

    function createAllTable(){
        let data = []
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team)
            
            data.push({
                teamNumber : team,
                score_by_match : getAverageDBvalues(teamData, allPoints, true),
                total_coral_l1 : getAverageDBvalues(teamData, ["autoROneScore", "teleopROneScore"], true),
                hit_rate_l1 : (getAverageDBvalues(teamData, ["autoROneScore", "teleopROneScore"], false) / (getAverageDBvalues(teamData, ["autoROneScore", "teleopROneScore"], true) + getAverageDBvalues(teamData, ["autoROneMiss", "teleopROneMiss"], false))) * 100,
                total_coral_l2 : getAverageDBvalues(teamData, ["autoRTwoScore", "teleopRTwoScore"], true),
                hit_rate_L2 : (getAverageDBvalues(teamData, ["autoRTwoScore", "teleopRTwoScore"], false) / (getAverageDBvalues(teamData, ["autoRTwoScore", "teleopRTwoScore"], true) + getAverageDBvalues(teamData, ["autoRTwoMiss", "teleopRTwoMiss"], false))) * 100,
                total_coral_l3 : getAverageDBvalues(teamData, ["autoRThreeScore", "teleopRThreeScore"], true),
                hit_rate_l3 : (getAverageDBvalues(teamData, ["autoRThreeScore", "teleopRThreeScore"], false) / (getAverageDBvalues(teamData, ["autoRThreeScore", "teleopRThreeScore"], true) + getAverageDBvalues(teamData, ["autoRThreeMiss", "teleopRThreeMiss"], false))) * 100,
                total_coral_l4 : getAverageDBvalues(teamData, ["autoRFourScore", "teleopRFourScore"], true),
                hit_rate_l4 : (getAverageDBvalues(teamData, ["autoRFourScore", "teleopRFourScore"], false) / (getAverageDBvalues(teamData, ["autoRFourScore", "teleopRFourScore"], true) + getAverageDBvalues(teamData, ["autoRFourMiss", "teleopRFourMiss"], false))) * 100,
                processor_score : getAverageDBvalues(teamData, ["autoProcessorScore", "teleopProcessorScore"], true),
                hit_rate_processor : (getAverageDBvalues(teamData, ["autoProcessorScore", "teleopProcessorScore"], false) / (getAverageDBvalues(teamData, ["autoProcessorScore", "teleopProcessorScore"], true) + getAverageDBvalues(teamData, ["autoProcessorMiss", "teleopProcessorMiss"], false))) * 100,
                net_score : getAverageDBvalues(teamData, ["autoNetScore", "teleopNetScore"], true),
                hit_rate_net : (getAverageDBvalues(teamData, ["autoNetScore", "teleopNetScore"], false) / (getAverageDBvalues(teamData, ["autoNetScore", "teleopNetScore"], true) + getAverageDBvalues(teamData, ["autoNetMiss", "teleopNetMiss"], false))) * 100,
                avg_cycle_floor : getAverageCycleData(teamData, ["coralFloorCycleTime", "algaeCycleTime"], false),
                avg_cycle_source : getAverageCycleData(teamData, ["coralStationCycleTime", "algaeCycleTime"], false),
                attempts_shallow : getAverageDBvalues(teamData, ["bargeStatus"], false),
                attempts_deep : getAverageDBvalues(teamData, ["bargeStatus"], false),
                avg_cycle_barge : getAverageDBvalues(teamData, ["bargeTime"], false),
            })
            
        });
        teamsData = data;
    }

    function createAutoTable(){
        let data = []
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team)
            
            data.push({
                teamNumber : team,
                score_by_match : getAverageDBvalues(teamData, autoPoints, true),
                total_coral_l1 : getAverageDBvalues(teamData, ["autoROneScore"], true),
                hit_rate_l1 : (getAverageDBvalues(teamData, ["autoROneScore"], true) / (getAverageDBvalues(teamData, ["autoROneScore"], true) + getAverageDBvalues(teamData, ["autoROneMiss"], true))) * 100,
                total_coral_l2 : getAverageDBvalues(teamData, ["autoRTwoScore"], true),
                hit_rate_L2 : (getAverageDBvalues(teamData, ["autoRTwoScore"], true) / (getAverageDBvalues(teamData, ["autoRTwoScore"], true) + getAverageDBvalues(teamData, ["autoRTwoMiss"], true))) * 100,
                total_coral_l3 : getAverageDBvalues(teamData, ["autoRThreeScore"], true),
                hit_rate_l3 : (getAverageDBvalues(teamData, ["autoRThreeScore"], true) / (getAverageDBvalues(teamData, ["autoRThreeScore"], true) + getAverageDBvalues(teamData, ["autoRThreeMiss"], true))) * 100,
                total_coral_l4 : getAverageDBvalues(teamData, ["autoRFourScore"], true),
                hit_rate_l4 : (getAverageDBvalues(teamData, ["autoRFourScore"], true) / (getAverageDBvalues(teamData, ["autoRFourScore"], true) + getAverageDBvalues(teamData, ["autoRFourMiss"], true))) * 100,
                processor_score : getAverageDBvalues(teamData, ["autoProcessorScore"], true),
                hit_rate_processor : (getAverageDBvalues(teamData, ["autoProcessorScore"], true) / (getAverageDBvalues(teamData, ["autoProcessorScore"], true) + getAverageDBvalues(teamData, ["autoProcessorMiss"], true))) * 100,
                net_score : getAverageDBvalues(teamData, ["autoNetScore"], true),
                hit_rate_net : (getAverageDBvalues(teamData, ["autoNetScore"], true) / (getAverageDBvalues(teamData, ["autoNetScore"], true) + getAverageDBvalues(teamData, ["autoNetMiss"], true))) * 100,
            })
    
        });
        teamsData = data;
    }

    function createTeleopTable(){
        let data = []
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team)
            
            data.push({
                teamNumber : team,
                score_by_match : getAverageDBvalues(teamData, teleopPoints, true),
                total_coral_l1 : getAverageDBvalues(teamData, ["teleopROneScore"], true),
                hit_rate_l1 : (getAverageDBvalues(teamData, ["teleopROneScore"], true) / (getAverageDBvalues(teamData, ["teleopROneScore"], true) + getAverageDBvalues(teamData, ["teleopROneMiss"], true))) * 100,
                total_coral_l2 : getAverageDBvalues(teamData, ["teleopRTwoScore"], true),
                hit_rate_L2 : (getAverageDBvalues(teamData, ["teleopRTwoScore"], true) / (getAverageDBvalues(teamData, ["teleopRTwoScore"], true) + getAverageDBvalues(teamData, ["teleopRTwoMiss"], true))) * 100,
                total_coral_l3 : getAverageDBvalues(teamData, ["teleopRThreeScore"], true),
                hit_rate_l3 : (getAverageDBvalues(teamData, ["teleopRThreeScore"], true) / (getAverageDBvalues(teamData, ["teleopRThreeScore"], true) + getAverageDBvalues(teamData, ["teleopRThreeMiss"], true))) * 100,
                total_coral_l4 : getAverageDBvalues(teamData, ["teleopRFourScore"], true),
                hit_rate_l4 : (getAverageDBvalues(teamData, ["teleopRFourScore"], true) / (getAverageDBvalues(teamData, ["teleopRFourScore"], true) + getAverageDBvalues(teamData, ["teleopRFourMiss"], true))) * 100,
                processor_score : getAverageDBvalues(teamData, ["teleopProcessorScore"], true),
                hit_rate_processor : (getAverageDBvalues(teamData, ["teleopProcessorScore"], true) / (getAverageDBvalues(teamData, ["teleopProcessorScore"], true) + getAverageDBvalues(teamData, ["teleopProcessorMiss"], true))) * 100,
                net_score : getAverageDBvalues(teamData, ["teleopNetScore"], true),
                hit_rate_net : (getAverageDBvalues(teamData, ["teleopNetScore"], true) / (getAverageDBvalues(teamData, ["teleopNetScore"], true) + getAverageDBvalues(teamData, ["teleopNetMiss"], true))) * 100,
                avg_cycle_floor : getAverageCycleData(teamData, ["coralFloorCycleTime", "algaeCycleTime"], false),
                avg_cycle_source : getAverageCycleData(teamData, ["coralStationCycleTime", "algaeCycleTime"], false),
            })
    
        });
        teamsData = data;
    }

    function createEndgameTable(){
        let data = []
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team)
            
            data.push({
                teamNumber : team,
                score_by_match : getAverageDBvalues(teamData, ["bargeStatus"], false),
                attempts_shallow : getAverageDBvalues(teamData, ["bargeStatus"], false),
                attempts_deep : getAverageDBvalues(teamData, ["bargeStatus"], false),
                avg_cycle_barge : getAverageDBvalues(teamData, ["bargeTime"], false),
            })
    
        });
        teamsData = data;
    }

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white mb-20">
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i on:click={()=>{goto("/dataAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <h1 class="grow flex flex-row items-center text-2xl font-medium tracking-wide">{$_("dataAnalysis.picklist.title")}</h1>
    </div>
    <div class="w-full flex flex-row gap-2 px-6 mb-2">
        <button on:click={()=>{displayFilter="all"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="all" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
          {$_('storage.filters.all')}
        </button>
        <button on:click={()=>{displayFilter="auto"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="auto" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
          Auto
        </button>
        <button on:click={()=>{displayFilter="teleop"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="teleop" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
          Teleop
        </button>
        <button on:click={()=>{displayFilter="endgame"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="endgame" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
          Endgame
        </button>
      </div>  

    {#key teamsData}
        <div class="overflow-x-auto w-full pl-6 rounded-md overflow-hidden">
            <table class="table">
                <thead>
                    {#each Object.keys(teamsData[0]) as heading}
                    <th class="bg-primary-opac">{$_(`dataAnalysis.picklist.${heading}`)}</th>
                    {/each}             
                </thead>
                <tbody>
                    {#each teamsData as team}
                        <tr>
                            {#each Object.keys(team) as key}
                                {#if key.includes("hit")}
                                    <th>{!team[key] ? "-" : team[key].toFixed(1)+"%"}</th> 
                                {:else if key.includes("cycle")}
                                    <th>{!team[key] ? "-" : team[key].toFixed(1)+"s"}</th> 
                                {:else} 
                                    <th>{team[key]}</th>
                                {/if}
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/key}
</main>