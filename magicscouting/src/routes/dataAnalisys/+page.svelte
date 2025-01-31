<script>
// @ts-nocheck

	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { BarChartSimple } from '@carbon/charts-svelte'

    import { goto } from "$app/navigation";

    import SyncData from "$lib/components/SyncDataButton.svelte";
    import SyncDataButton from "$lib/components/SyncDataButton.svelte";

    function formatToChart(entry){
        let chartData = []
        
        for (let i = 0; i < Object.keys(entry).length; i++){
            let key = Object.keys(entry)[i]
            let value = Object.values(entry)[i]
            chartData.push({group: key, value: value})
        }

        return chartData
    }

    onMount(async () => {
        if (localStorage.getItem("MatchSchema") == "Not assigned" || localStorage.getItem("PitSchema") == "Not assigned"){
            SyncData();
        }
    })
    
    
</script>

<SyncDataButton />
<button on:click={() => {goto('/dataAnalisys/teamAnalisys')}}>Team Analisys</button>

<!-- 
['timeStamp', 'team', 'match', 'arenaPos', 'red/blue', 
'autoROneScore', 'autoRTwoScore', 'autoRThreeScore', 'autoRFourScore', 
'autoROneMiss', 'autoRTwoMiss', 'autoRThreeMiss', 'autoRFourMiss', 
'isLeave', 
’autoProcessorScore’, 'autoProcessorMiss’, 
‘autoRemoveAlgaeLow’, ‘autoRemoveAlgaeHigh’,  
'teleopROneScore', 'teleopRTwoScore', 'teleopRThreeScore', 'teleopRFourScore', 
'teleopROneMiss', 'teleopRTwoMiss', 'teleopRThreeMiss', 'teleopRFourMiss', 
’teleopProcessorScore’, ‘teleopProcessorMiss’, 
‘teleopRemoveAlgaeLow’, ‘teleopRemoveAlgaeHigh’, 
'bargeStatus', 'bargeTime', 'stationCycleTime', 'floorCycleTime', ‘netScore’, 'humanNetScore', ‘netMiss’, 'humanNetMiss', 'matchFunction', 'stationAverage', 'floorAverage'] -->