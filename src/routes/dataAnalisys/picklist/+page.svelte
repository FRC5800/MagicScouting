<script>
    import { run } from 'svelte/legacy';

    // @ts-nocheck
    import { TeamsDB } from "$lib/shared/stores/teamsData";
    import { _ } from 'svelte-i18n';
    import { goto } from "$app/navigation";
    import { getSortedTeams, getTeamScoutingData, getAverageDBvalues } from "$lib/shared/scripts/chartUtilities";
    import { App } from '@capacitor/app';
    App.addListener("backButton", () => {goto("/dataAnalisys")});

    let allTeams = getSortedTeams($TeamsDB);
    let displayFilter = $state("all");
    let teamsData = $state([]);
    let reverseFilter = $state(false);

    /**
     * Calculate auto points for a single match
     * autoPoints = autoFuelNumber + autoClimb (15 if true)
     */
    function calculateAutoPoints(match) {
        let points = 0;
        // autoFuelNumber = 1 point per fuel
        const autoFuel = Number(match.autoFuelNumber) || 0;
        points += autoFuel;
        
        // autoClimb = 15 points if true
        if (match.autoClimb === 'true' || match.autoClimb === true) {
            points += 15;
        }
        
        return points;
    }

    /**
     * Calculate teleop points for a single match
     * teleopPoints = teleopFuelNumber + teleopClimb (L1=10, L2=20, L3=30)
     */
    function calculateTeleopPoints(match) {
        let points = 0;
        // teleopFuelNumber = 1 point per fuel
        const teleopFuel = Number(match.teleopFuelNumber) || 0;
        points += teleopFuel;
        
        // teleopClimb points based on level
        const climbLevel = match.teleopClimb || 'none';
        if (climbLevel === 'L1') {
            points += 10;
        } else if (climbLevel === 'L2') {
            points += 20;
        } else if (climbLevel === 'L3') {
            points += 30;
        }
        
        return points;
    }

    /**
     * Calculate all points for a single match
     * allPoints = autoPoints + teleopPoints
     */
    function calculateAllPoints(match) {
        return calculateAutoPoints(match) + calculateTeleopPoints(match);
    }

    /**
     * Get average value from team data for a specific field
     */
    function getAverageValue(teamData, field) {
        if (!teamData || teamData.length === 0) return 0;
        
        const values = teamData
            .map(match => {
                const value = match[field];
                if (value === undefined || value === null || value === '') return 0;
                // Handle boolean values
                if (value === 'true' || value === true) return 1;
                if (value === 'false' || value === false) return 0;
                return Number(value) || 0;
            })
            .filter(v => !isNaN(v));
        
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    /**
     * Get average auto points for a team
     */
    function getAverageAutoPoints(teamData) {
        if (!teamData || teamData.length === 0) return 0;
        const points = teamData.map(match => calculateAutoPoints(match));
        return points.reduce((sum, p) => sum + p, 0) / points.length;
    }

    /**
     * Get average teleop points for a team
     */
    function getAverageTeleopPoints(teamData) {
        if (!teamData || teamData.length === 0) return 0;
        const points = teamData.map(match => calculateTeleopPoints(match));
        return points.reduce((sum, p) => sum + p, 0) / points.length;
    }

    /**
     * Get average all points for a team
     */
    function getAverageAllPoints(teamData) {
        if (!teamData || teamData.length === 0) return 0;
        const points = teamData.map(match => calculateAllPoints(match));
        return points.reduce((sum, p) => sum + p, 0) / points.length;
    }

    /**
     * Count how many times a boolean field is true
     */
    function countTrue(teamData, field) {
        if (!teamData || teamData.length === 0) return 0;
        return teamData.filter(match => {
            const value = match[field];
            return value === 'true' || value === true || value === '1';
        }).length;
    }

    /**
     * Get percentage of matches where a boolean field is true
     */
    function getPercentage(teamData, field) {
        if (!teamData || teamData.length === 0) return 0;
        const trueCount = countTrue(teamData, field);
        return (trueCount / teamData.length) * 100;
    }

    /**
     * Get average climb time
     */
    function getAverageClimbTime(teamData, phase) {
        const field = phase === 'auto' ? 'autoClimbTime' : 'teleopClimbTime';
        return getAverageValue(teamData, field);
    }

    /**
     * Get climb success rate
     */
    function getClimbSuccessRate(teamData, phase) {
        const climbField = phase === 'auto' ? 'autoClimb' : 'teleopClimb';
        return getPercentage(teamData, climbField);
    }

    function createAllTable(){
        let data = [];
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team);
            
            data.push({
                teamNumber: team,
                score_by_match: getAverageAllPoints(teamData),
                auto_points: getAverageAutoPoints(teamData),
                teleop_points: getAverageTeleopPoints(teamData),
                avg_auto_fuel: getAverageValue(teamData, 'autoFuelNumber'),
                avg_teleop_fuel: getAverageValue(teamData, 'teleopFuelNumber'),
                avg_feeding_fuel: getAverageValue(teamData, 'feedingFuelNumber'),
                auto_climb_rate: getClimbSuccessRate(teamData, 'auto'),
                avg_auto_climb_time: getAverageClimbTime(teamData, 'auto'),
                teleop_climb_rate: getClimbSuccessRate(teamData, 'teleop'),
                avg_teleop_climb_time: getAverageClimbTime(teamData, 'teleop'),
                passes_by_bump_rate: getPercentage(teamData, 'passesByBump'),
                passes_by_trench_rate: getPercentage(teamData, 'passesByLowBar'),
            });
        });
        teamsData = data;
    }

    function createAutoTable(){
        let data = [];
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team);
            
            data.push({
                teamNumber: team,
                score_by_match: getAverageAutoPoints(teamData),
                avg_auto_fuel: getAverageValue(teamData, 'autoFuelNumber'),
                auto_climb_rate: getClimbSuccessRate(teamData, 'auto'),
                avg_auto_climb_time: getAverageClimbTime(teamData, 'auto'),
                collects_from_ground: getPercentage(teamData, 'autoCollectsFromGround'),
                collects_from_outpost: getPercentage(teamData, 'autoCollectsFromOutpost'),
                collects_from_neutral: getPercentage(teamData, 'autoCollectsFromNeutral'),
                collects_from_depot: getPercentage(teamData, 'autoCollectsFromDepot'),
            });
        });
        teamsData = data;
    }

    function createTeleopTable(){
        let data = [];
        allTeams.forEach(team => {
            let teamData = getTeamScoutingData(team);
            
            data.push({
                teamNumber: team,
                score_by_match: getAverageTeleopPoints(teamData),
                avg_teleop_fuel: getAverageValue(teamData, 'teleopFuelNumber'),
                avg_feeding_fuel: getAverageValue(teamData, 'feedingFuelNumber'),
                teleop_climb_rate: getClimbSuccessRate(teamData, 'teleop'),
                avg_teleop_climb_time: getAverageClimbTime(teamData, 'teleop'),
                collects_from_ground: getPercentage(teamData, 'teleopCollectsFromGround'),
                collects_from_outpost: getPercentage(teamData, 'teleopCollectsFromOutpost'),
                collects_from_neutral: getPercentage(teamData, 'teleopCollectsFromNeutral'),
                collects_from_depot: getPercentage(teamData, 'teleopCollectsFromDepot'),
                passes_by_bump_rate: getPercentage(teamData, 'passesByBump'),
                passes_by_trench_rate: getPercentage(teamData, 'passesByLowBar'),
            });
        });
        teamsData = data;
    }

    run(() => {
        if(displayFilter == "all"){
            createAllTable();
        } else if(displayFilter == "auto"){
            createAutoTable();
        } else if(displayFilter == "teleop"){
            createTeleopTable();
        }
    });
    
    let activeFilter = $state("score_by_match");
    
    run(() => {
        teamsData = teamsData.sort((a, b) => {
            if(reverseFilter){
                return a[activeFilter] - b[activeFilter];
            } else {
                return b[activeFilter] - a[activeFilter];
            }
        });
    });
</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white mb-20">
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i onclick={()=>{goto("/dataAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <h1 class="grow flex flex-row items-center text-2xl font-medium tracking-wide">{$_("dataAnalysis.picklist.title")}</h1>
    </div>
    <div class="w-full flex flex-row gap-2 px-6 mb-2">
        <button onclick={()=>{displayFilter="all"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="all" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
          {$_('storage.filters.all')}
        </button>
        <button onclick={()=>{displayFilter="auto"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="auto" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
          Auto
        </button>
        <button onclick={()=>{displayFilter="teleop"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="teleop" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
          Teleop
        </button>
      </div>  

    {#key teamsData}
        {#if teamsData.length > 0}
            <div class="overflow-x-auto w-full pl-6 rounded-md overflow-hidden">
                <table class="table">
                    <thead>
                        {#each Object.keys(teamsData[0]) as heading}
                        <th onclick={()=>{if (activeFilter.includes(heading) && !reverseFilter) {activeFilter = heading; reverseFilter = true} else{activeFilter = heading; reverseFilter = false}}} class="bg-primary-opac">
                            {$_(`dataAnalysis.picklist.${heading}`)}
                            {#if activeFilter.includes(heading) && !reverseFilter}
                                <i class="fi fi-rr-arrow-small-up"></i>
                            {:else if activeFilter.includes(heading) && reverseFilter}
                                <i class="fi fi-rr-arrow-small-down"></i>
                            {/if}
                        </th>
                        {/each}             
                    </thead>
                    <tbody>
                        {#each teamsData as team}
                            <tr>
                                {#each Object.keys(team) as key}
                                    {#if key.includes("rate") || key.includes("percentage")}
                                        <th>{!team[key] ? "-" : team[key].toFixed(1)+"%"}</th> 
                                    {:else if key.includes("time")}
                                        <th>{!team[key] ? "-" : team[key].toFixed(1)+"s"}</th>
                                    {:else if key.includes("points") || key.includes("score")}
                                        <th>{team[key].toFixed(1)}</th>
                                    {:else} 
                                        <th>{team[key]}</th>
                                    {/if}
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <div class="w-full flex justify-center items-center p-8">
                <p class="text-neutral-500">No data available</p>
            </div>
        {/if}
    {/key}
</main>
