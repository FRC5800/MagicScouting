<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    import '@carbon/charts-svelte/styles.css'
	import { BarChartSimple } from '@carbon/charts-svelte'

    Object.filter = (obj, predicate) => 
                  Object.fromEntries(Object.entries(obj).filter(predicate));

    function isNumeric(str) { 
        return !isNaN(str) && !isNaN(parseFloat(str))
    }


    function formatEntry(schema, data){
        let entry = {}
        for (let i = 0; i < schema.length; i++){
            entry[schema[i]] = data[i]
        }
        return entry
    }

    function formatToChart(entry){
        let chartData = []
        
        for (let i = 0; i < Object.keys(entry).length; i++){
            let key = Object.keys(entry)[i]
            let value = Object.values(entry)[i]
            chartData.push({group: key, value: value})
        }

        return chartData
    }

    $: data = {}

    onMount(async () => {
        let content = await fetch($dataBase+"?sheet=MagicScouting",
        {
            method: "GET",
            headers: {
                "Content-Type": "text/plain",
            }
        }).then((r) => {
            return r.json()
        })

        let schema = content[0];
        content = content.splice(1)

        console.log(schema)

        let allEntries = content.map((line) => {
            return formatEntry(schema, line)
        })
        
        let filtered = Object.filter(allEntries[1], value => isNumeric(value[1]))
        console.log(filtered)

        data = filtered

    })

    
    
</script>
<BarChartSimple
	data={formatToChart(data)}
	options={{
		theme: 'g90',
		title: 'Simple bar (discrete)',
		height: '400px',
		axes: {
			left: { mapsTo: 'value' },
			bottom: { mapsTo: 'group', scaleType: 'labels' }
		}
	}} />

<a href = "/teamAnalisys">Team Analisys</a>

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