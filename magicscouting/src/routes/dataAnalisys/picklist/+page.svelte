<script>
    import { TeamsDB } from "$lib/shared/stores/teamsData";

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex gap-4 mt-6 mb-6 flex-col items-center">
        <h1 class="text-2xl font-medium tracking-wide">Picklist</h1>
    </div>
<!-- 
    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <th>Equipe</th>
                <th>Value</th>
            </thead>
            <tbody>
                {#each Object.keys($TeamsDB) as key}
                    <tr>
                        <th>{key}</th>
                        <td>{$TeamsDB[key]}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div> -->
</main>