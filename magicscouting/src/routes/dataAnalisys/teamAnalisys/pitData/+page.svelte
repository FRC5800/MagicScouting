<script>
// @ts-nocheck

    import sessionStore from "$lib/shared/stores/sessionStorageStore";
    import { PitTeamsDB } from "$lib/shared/stores/teamsData";
    import { goto } from "$app/navigation";

    import { onMount } from "svelte";

    let pitScoutingSelectedData;
    let teamData;
    const selectedTeamData = sessionStore('selectedTeamData', {});

    let mounted = false;
    onMount(() => {
        console.log("Pit Data Page")
        console.log($PitTeamsDB)
    
        selectedTeamData.subscribe(value => {
            teamData = value
        });
    
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
    <img src={teamData.logo.src} alt="Team Logo" />
    <div>{teamData.name}</div>

    {#each Object.keys(pitScoutingSelectedData) as key}
        {#if key == "robotPicture"}
            <img src={getGoogleDriveImageUrl(pitScoutingSelectedData[key])} alt="Robot Picture" />
        {:else}
            <div>{key}: {pitScoutingSelectedData[key]}</div>
        {/if}
    {/each}
{/if}

<button on:click={() => {goto("/dataAnalisys/teamAnalisys")}}>Back</button>