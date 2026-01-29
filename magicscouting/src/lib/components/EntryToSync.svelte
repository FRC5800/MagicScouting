<script>
    import { run } from 'svelte/legacy';

// @ts-nocheck
    import { _ } from "svelte-i18n";
    
    import Modal from '$lib/components/Modal.svelte';
    import QRCode from "qrcode";
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import TrashCan from '$lib/components/TrashCan.svelte'
	import { entriesSync, syncedEntries } from "../shared/stores/toSyncData";
    import uploadPayload from "../shared/scripts/sheetsUpload";
    import { getDefaultLogo, getTBAData } from "$lib/shared/scripts/chartUtilities";
    import { onMount } from "svelte";
	import Toast from "./Toast.svelte";

    let { payload = $bindable({"team":5800, "match":2}), index } = $props();
    
    let src = $state('')

    let showQrCode = false
    run(() => {
        console.log(showQrCode)
    });
    
    function avgArray(arr){
        let sum = 0;
        arr.forEach((n) => {sum+=n});
        return arr.length > 0 ? sum/arr.length : 0;
    }
    let buttonColor = ""
    let uploadDisabled = $state(false);
    let uploadSuccess = $state('undefined');
    let buttonText = "Upload";
    let showRepeatedDataToast = $state(false);

    async function HandleUpload(){
        try{
            uploadDisabled = true;

            let response = JSON.parse(await uploadPayload(payload).then((r) => {return r.text()}));

            console.log(response)
            if (response.result == "success"){
                if(response.repeated){
                    uploadSuccess = false;
                    handleRepeatedData();
                }else{
                    payload.uploaded = true
                    HandleStore();
                    uploadSuccess = true;
                }
            }else{
                uploadSuccess = false;
            }
        }catch(e){
            alert(e);
        }
    } 
    function HandleStore(){                
        $entriesSync.splice($entriesSync.indexOf(payload), 1);
        $entriesSync = $entriesSync
        $syncedEntries.push(payload)
        $syncedEntries = $syncedEntries
        console.log(`Synced entries: `)
        console.log($syncedEntries)
        console.log(`Entries to sync:`);
        console.log($entriesSync)
    }

    function HandleDelete(){                
        $entriesSync.splice($entriesSync.indexOf(payload), 1); 
        console.log($entriesSync);
        $entriesSync = $entriesSync
    }

    function createQr() {
        QRCode.toDataURL(JSON.stringify(Object.keys(payload).map(function(key){return payload[key]})), { errorCorrectionLevel: 'L' }, function (err, url) {
        src = url;
    })
    }
    let teamData = $state({name:"Team", logo: getDefaultLogo()});
    onMount(() => {
        getTBAData(payload.team).then((r) => {
            teamData = r
        })
    })

    function handleRepeatedData(){
        showRepeatedDataToast = true;
        setTimeout(() => {
            HandleDelete()
        }, 3000); 
    }

    createQr()
</script>

<div class="bg-[#f0f0f0] dark:bg-surface w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-2 bg-[#121212] border-[#121212]">
            <div class="rounded-full w-fit h-fit overflow-hidden">
                <img width="45px" height="45px" src={teamData.logo ?? ""} alt="">
            </div>
        </div>
        <div class="dropdown absolute right-0 top-0 dropdown-end">
            <div tabindex="0" role="button" class="btn m-1"><i class="fi fi-br-menu-dots-vertical text-lg"></div>
            <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] min-w-36 shadow">
                <!-- <li><a>Edit</a></li> -->
                <li onkeydown={(e) => {if(e.key == "Enter") HandleDelete()}} onclick={() => {HandleDelete()}}><a href="">{$_('misc.delete_button')}</a></li>
            </ul>
        </div>
        <h3 class="ml-10 text-lg">Team {payload.team} - {teamData.name ?? ""}</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>{$_('storage.match')}: {payload.match}</span>
            <span>{$_('storage.team_position')}: {payload.arenaPos}</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button onclick={()=>{document.getElementById('entry_'+index).showModal()}} class="btn grow bg-primary-opac">{$_('misc.visualize_button')}</button>
            <button onclick={()=>{if(uploadSuccess != false) HandleUpload()}} class="btn btn-circle {(uploadDisabled || !$useDB) && uploadSuccess != false ? "btn-disabled" : ""} {!uploadSuccess ? 'btn-warning' : 'btn-primary hover:bg-primary-base bg-buttons border-buttons dark:bg-bg-buttons'}">
                {#if (uploadDisabled && uploadSuccess == "undefined")}
                    <span class="loading loading-spinner"></span>
                {:else}
                    <i class="fi fi-rr-progress-upload text-2xl flex"></i>
                {/if}
            </button>
          </div>
        </div>
      </div>

<dialog id={"entry_"+index} class="modal">
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <div class="flex flex-col justify-center items-center">
            <h1 class="text-[1.8rem] font-semibold">{$_('storage.modal.title')}</h1>
            <div class="flex items-center justify-center border-[1rem] rounded-lg border-primary-base w-fit">
                <img class="h-auto" {src} alt="">
            </div>
            <h1 class="text-[1.4rem] font-semibold">{$_('storage.modal.scan_me')}</h1>
        </div>

    </div>
    <form method="dialog" class="modal-backdrop">
        <button>{$_('misc.close_button')}</button>
    </form>
</dialog>

<Toast showToast={showRepeatedDataToast} message={"Repeated Data! Data wil be deleted"}/>