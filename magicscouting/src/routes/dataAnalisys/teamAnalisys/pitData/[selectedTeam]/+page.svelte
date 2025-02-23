<script>
// @ts-nocheck

    import teamAnalysisData from "$lib/shared/stores/teamAnalysisData";
    import { PitTeamsDB } from "$lib/shared/stores/teamsData";
    import { goto } from "$app/navigation";

    import { onMount } from "svelte";
    export let data;
    let teamData = $teamAnalysisData[data.selectedTeam];
    let pitScoutingSelectedData;

    let mounted = false;
    onMount(() => {
        console.log("Pit Data Page")
        console.log($PitTeamsDB)
    
        for (let i = 0; i < $PitTeamsDB.length; i++){
            if ($PitTeamsDB[i].teamNumber == teamData.teamNumber){
                pitScoutingSelectedData = $PitTeamsDB[i]
            }
        }
        mounted = true;
    })
    function getGoogleDriveImageUrl(fileId) {
        let fid = fileId.split("=")
        fid = fid[fid.length - 1]
        console.log(fid)
        
        return `https://drive.google.com/uc?export=view&id=${fid}`;

        // return `https://drive.google.com/thumbnail?id=${fid}&sz=w1000`;
    }

</script>
{#if mounted}
    <div class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg">
        <i on:click={()=>{goto("/dataAnalisys/teamAnalisys")}} class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"></i>
        <div class="grow flex flex-row gap-4 items-center">

            <img width="50px" src={teamData.logo} alt="Team Logo" />
            <div class="flex flex-row gap-2">
                <div>{teamData.team}</div>
                <div>{teamData.name}</div>
            </div>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <th>Camp</th>
                <th>Value</th>
            </thead>
            <tbody>
                {#each Object.keys(pitScoutingSelectedData) as key}
                    {#if key == "robotPicture"}
                        <img src={getGoogleDriveImageUrl(pitScoutingSelectedData[key])} alt="Robot Picture" />
                    {:else}
                        <tr>
                            <th>{key}</th>
                            <td>{pitScoutingSelectedData[key]}</td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<div class="px-6 my-6">
    <button on:click={() => {goto("/dataAnalisys/teamAnalisys")}} class="btn btn-block">Back</button>
</div>