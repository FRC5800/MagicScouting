<script>
// @ts-nocheck

    import { carbonTheme } from '$lib/shared/stores/darkMode.js';
    import { _ } from 'svelte-i18n';
    import { App } from '@capacitor/app';
    import { goto } from '$app/navigation';
    App.addListener("backButton", () => {goto("/dataAnalisys/teamAnalisys")});

    import { DonutChart } from '@carbon/charts-svelte'
    import { writable } from 'svelte/store';
    import { getTeamScoutingData } from "$lib/shared/scripts/chartUtilities";
    import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";

    export let data;
    let teamData = $teamAnalysisData[data.selectedTeam];
    let rawData = writable(getTeamScoutingData(teamData.teamNumber));

    /**
     * Calculate climb success rate
     */
    function getClimbSuccessRate() {
        if (!$rawData || $rawData.length === 0) return 0;
        const successCount = $rawData.filter(match => {
            const climb = match.teleopClimb;
            return climb && climb !== 'none' && climb !== '';
        }).length;
        return (successCount / $rawData.length) * 100;
    }

    /**
     * Get average climb time (only for successful climbs)
     */
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

    /**
     * Setup climb level distribution chart data
     */
    function getClimbLevelDistribution() {
        if (!$rawData || $rawData.length === 0) return [];
        
        const distribution = {
            'none': 0,
            'L1': 0,
            'L2': 0,
            'L3': 0
        };
        
        $rawData.forEach(match => {
            const climb = match.teleopClimb || 'none';
            if (distribution.hasOwnProperty(climb)) {
                distribution[climb]++;
            } else {
                distribution['none']++;
            }
        });
        
        return [
            { group: 'No Climb', value: distribution['none'] },
            { group: 'L1', value: distribution['L1'] },
            { group: 'L2', value: distribution['L2'] },
            { group: 'L3', value: distribution['L3'] }
        ];
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

<div class="w-full px-6 mb-16 flex flex-col items-center">
    {#if $rawData.length > 0}
        <div class="w-full flex">
            <div class="w-full relative mb-2 mx-6 grow">
                <div class="flex flex-row justify-around items-center gap-2">
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>Climb Success Rate</h3>
                        <span class="text-primary-base text-xl">{getClimbSuccessRate().toFixed(1)}%</span>
                    </div>
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>Avg Climb Time</h3>
                        <span class="text-primary-base text-xl">{getAverageClimbTime().toFixed(1)}s</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full flex">
            <div class="w-full relative mb-2 mx-6 grow">
                <div class="flex flex-row justify-around items-center gap-2">
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>Passes by Bump</h3>
                        <span class="text-primary-base text-xl">{getPassesByBumpRate().toFixed(1)}%</span>
                    </div>
                    <div class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2">
                        <h3>Passes by Trench</h3>
                        <span class="text-primary-base text-xl">{getPassesByTrenchRate().toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </div>

        <DonutChart
            data={getClimbLevelDistribution()}
            options={{
                theme: $carbonTheme,
                title: "Climb Level Distribution",
                height: "300px",
                width: "300px",
            }}
        />

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

    {:else}
        <div class="w-full flex justify-center items-center p-8">
            <p class="text-neutral-500">No data available</p>
        </div>
    {/if}

    <div class="divider"></div>
</div>
