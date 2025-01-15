<script>
// @ts-nocheck

    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";
    import Chart from '$lib/components/Chart.svelte'
	import { CommonProgramFiles } from "$env/static/private";

    function formatEntry(schema, data){
        let entry = {}
        for (let i = 0; i < schema.length; i++){
            entry[schema[i]] = data[i]
        }
        return entry
    }

    $: config = {}

    onMount(async () => {
        let content = await fetch($dataBase,
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
        
    })

    let chartType = 'bar'

    let myData = {
    labels: Object.values(allEntries[2]).splice(8, 15),
    datasets: [
                {
                label: "Appointment Requests (by location)",
                // backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
                data: Object.values(allEntries[2]).splice(8, 15),
                // tension: 0.32,
                borderWidth: 1,
                }
            ],
    }

let options = null

config = {
    chartType,
    myData,
    options 
}
    
    
</script>

<Chart {config} />