<script>
    // @ts-nocheck

    import { writable } from "svelte/store";
    import { TeamsDB } from "$lib/shared/stores/teamsData";
    import { _ } from 'svelte-i18n';

    import { getTeamScoutingData, getTBAData, getStatBoticsData } from "$lib/shared/scripts/chartUtilities";
    import { Keyboard } from "@capacitor/keyboard";
    import { Capacitor } from "@capacitor/core";

    $: data = $TeamsDB

    let focus = false;

    export let teamSearch = "";
    export let selectedTeam = "";
    export let analysisData;

    $: console.log(analysisData)

    async function search(){
        focus = true;
        if(teamSearch != ""){
            selectedTeam = teamSearch
            teamSearch = ""
            if (Capacitor.getPlatform()=="android"){
                await Keyboard.hide()
            }
            await createTeam()
        }
        focus = false;
    }

    $: autoCompleteTeams = writable([]);

    let debounceTimeout;

    $: if (teamSearch != "") {
        console.log(teamSearch);
        let alreadyIn = [];
        let filterSugestions = data.filter((entry) => {
            let condition = entry["team"].toString().includes(teamSearch) && entry["team"].toString() != teamSearch && !alreadyIn.includes(entry["team"].toString());
            alreadyIn.push(entry["team"].toString());
            return condition;
        });

        autoCompleteTeams.set(filterSugestions);
    } else {
        autoCompleteTeams.set([]);
    }

    async function createTeam(){
        
        let teamData = {
            logo: new Image(),
            team: "",
            EPA: "",
            winrate: "",
            name: "",
            rawData: getTeamScoutingData(selectedTeam)
        }
        teamData.team = selectedTeam

        analysisData[String(teamData.team)] = teamData

        getStatBoticsData(selectedTeam).then((r) => {
            console.log(r)
            teamData.winrate = r.winrate
            teamData.EPA = r.epa
            analysisData[String(teamData.team)] = teamData
        })

        getTBAData(selectedTeam).then((r) => {
            teamData.logo = r.logo
            teamData.name = r.name
            analysisData[String(teamData.team)] = teamData
        });
    }

    function deleteArrayItem(array, itemIndex){
        let newArray = array.reduce(
            (acc, value, index) => {
                if(index != itemIndex){
                    acc.push(value);
                }
                return acc;
            }, [])
        return newArray;
    }

    function handleFocus(value){
        setTimeout(()=>{
        focus = value
        }, 500)
    }

</script>

<div class="w-full flex justify-start items-center input input-bordered gap-4 text-base relative">

    <i class="fi fi-rs-search flex"></i>

    <input class="grow" type="search" name="search" on:focusout={()=>{handleFocus(false)}} on:focusin={()=>{handleFocus(true)}} on:keydown={(e)=>{if(e.key == "Enter") search()}} bind:value={teamSearch} placeholder={$_("dataAnalysis.teamAnalysis.searchBar_placeholder")} />

        {#if $autoCompleteTeams.length > 0 && focus}    
            <div class="flex justify-center items-center absolute top-[calc(100%+1rem)] z-10 left-0 border-primary-heavy border-2 rounded-md max-h-80 overflow-y-scroll">
                <div class="menu rounded-md text-base bg-base-200 min-w-fit w-2/5 text-center px-3">
                    {#each $autoCompleteTeams as team}
                    <li>
                        <button on:click={() => {teamSearch=team.team; search()}}>{team.team}</button>
                    </li>
                    {/each}
                </div>
            </div>  
        {/if}
</div>