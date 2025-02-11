<script>
// @ts-nocheck
    import { _ } from "svelte-i18n";
    
    import Modal from '$lib/components/Modal.svelte';
    import QRCode from "qrcode";
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import TrashCan from '$lib/components/TrashCan.svelte'
	import { entriesSync, syncedEntries } from "../shared/stores/toSyncData";
    import uploadPayload from "../shared/scripts/sheetsUpload";
    import { getTBAData } from "$lib/shared/scripts/chartUtilities";
    import { onMount } from "svelte";

    export let payload = {"team":5800, "match":2};
    
    let src = ''

    let showQrCode = false
    $: console.log(showQrCode)
    
    function avgArray(arr){
        let sum = 0;
        arr.forEach((n) => {sum+=n});
        return arr.length > 0 ? sum/arr.length : 0;
    }
    let buttonColor = ""
    let uploadDisabled = false;
    let uploadSuccess = 'undefined';
    let buttonText = "Upload";

    async function HandleUpload(){
        try{
            uploadDisabled = true;

            let response = JSON.parse(await uploadPayload(payload).then((r) => {return r.text()}));

            console.log(response)
            if (response.result == "success"){
                payload.uploaded = true
                HandleStore();
                uploadSuccess = true;
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
    }

    function createQr() {
        QRCode.toDataURL(JSON.stringify(Object.keys(payload).map(function(key){return payload[key]})), { errorCorrectionLevel: 'L' }, function (err, url) {
        src = url;
    })
    }
    let teamData = {name:"Team", logo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFlSURBVFhH7ZbrcoYgDER9/3fW1t0eHApeUCNfO+P5Iwlhs6IyDi8v8JUxTROjGso/Ax52DSZY0h/6N6EbYVk/xnGk/Q9pN1t2VSDzPPS7jG4UqXjoEQKSMaD5CLS4DjphlO/srQ8KjTCQXdVlqh3WhYL0qnbTTqowXZ/CjWYIK5iuSZOu6sDW+WkzJcyFGkxaupaH/BFas6BE/vxdEYC0ZCwdzFs7tobqDbEp47tIT6Zyk0wdolpDbMo4gmTQzYCpXZYnSmxaF1/FDYHULpU5QXgb5Co90pv5XzBnSN02iEwMaBpSlwzmJ0Ao5WevHMNTWGwmH4cQYdBCM4SxBtFcUK40fUSuo3E4aBvFOrNascAM4fMGxVpuCwvMEP5dg+m1IIzH6kCqySSlprvJ1o/Fi6GMQ3E3IHV6Fx+HntWuHEFpP87+Hul1oPRz4OUQyj8HPnb5Vzsqs+WJgEQ/6LsLpS8dGYZvcbHBRHh4pVkAAAAASUVORK5CYII="};
    onMount(() => {
        getTBAData(payload.team).then((r) => {
            teamData = r
        })
    })

    createQr()
</script>

<div class="bg-[#f0f0f0] dark:bg-surface w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamData.logo ?? ""} alt="">
        </div>
        <div class="dropdown absolute right-0 top-0 dropdown-end">
            <div tabindex="0" role="button" class="btn m-1"><i class="fi fi-br-menu-dots-vertical text-lg"></div>
            <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] min-w-36 shadow">
                <!-- <li><a>Edit</a></li> -->
                <li on:keydown={(e) => {if(e.key == "Enter") HandleDelete()}} on:click={() => {HandleDelete(); $entriesSync = $entriesSync}}><a href="">{$_('misc.delete_button')}</a></li>
            </ul>
        </div>
        <h3 class="ml-10 text-lg">Team {payload.team} - {teamData.name ?? ""}</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>{$_('storage.match')}: {payload.match}</span>
            <span>{$_('storage.team_position')}: {payload.arenaPos}</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button onclick="document.getElementById('my_modal_2').showModal()" class="btn grow bg-primary-opac">{$_('misc.visualize_button')}</button>
            <button on:click={HandleUpload} class="btn btn-circle bg-primary-light dark:bg-primary-light {uploadDisabled || !$useDB ? "btn-disabled" : ""}">
              <i class="fi fi-rr-progress-upload text-2xl flex"></i>
            </button>
          </div>
        </div>
      </div>

<dialog id="my_modal_2" class="modal">
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