<script>
// @ts-nocheck

    /** @type {{ data: import('./$types').PageData }} */
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
	import { onMount } from "svelte";

    function formatEntry(schema, data){
        let entry = {}
        for (let i = 0; i < schema.length; i++){
            entry[schema[i]] = data[i]
        }
        return entry
    }

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

        console.table(allEntries)

    })

</script>

