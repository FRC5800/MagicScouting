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

<div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamData.logo ?? ""} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Edit</li>
            <li on:keydown={(e) => {if(e.key == "Enter") HandleDelete()}} on:click={() => {HandleDelete(); $entriesSync = $entriesSync}}>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team {payload.team} - {teamData.name ?? ""}</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>Match: {$_('storage.match')}: {payload.match}</span>
            <span>Position: {$_('storage.match')}: {payload.arenaPos}</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button on:click={() => {showQrCode = true}} class="btn grow">Visualize</button>
            <button on:click={HandleUpload} class="btn btn-circle {uploadDisabled || !$useDB ? "btn-disabled" : ""}">
              <i class="fi fi-rr-progress-upload text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

<!-- <section class="flex flex-row w-full p-1 mb-4 bg-gray-300 border-b-2 rounded-md shadow-sm shadow-primary-light dark:bg-gray-700">
    <div class="flex items-center justify-center pr-3 border-r border-grey-heavy w-fit">
        <i {src} alt="A Qr Code"  class="fa-solid fa-qrcode {uploadSuccess === true ? 'text-green-600' : uploadSuccess === false ? 'text-red-600' : ''} text-[100px]"></i>
    </div>

    <div class="flex flex-col items-start justify-between w-full ml-3 overflow-auto">
        
        <div class="flex flex-row justify-around w-full text-lg">
            <h1 class="text-2xl">{$_('storage.team')}: {payload.team}</h1>
            <h1 class="text-2xl">{$_('storage.match')}: {payload.match}</h1>
        </div>
        
        <div class="w-full p-2 overflow-hidden overflow-x-auto text-gray-300 rounded-lg bg-grey-heavy">{JSON.stringify(payload)}</div>

        <div class="flex flex-row items-center justify-around w-full">
            <button class="p-3 btn w-fit h-fit text-xs {!$useDB ? 'disabled-btn' : ''} {buttonColor}" disabled={uploadDisabled || !$useDB}  on:click={HandleUpload}>{buttonText}</button>
            <button class="p-3 text-xs btn w-fit h-fit" on:click={() => {showQrCode = true}}>{$_('storage.scan_button')}</button>
            <TrashCan scale={0.7} on:keydown={(e) => {if(e.key == "Enter") HandleDelete()}} on:click={() => {HandleDelete(); $entriesSync = $entriesSync}}/>
        </div>
    </div>
</section> -->

<Modal bind:showModal={showQrCode}> 
    <h1 class="text-[1.8rem] font-semibold">{$_('storage.modal.title')}</h1>
    <div class="flex items-center justify-center border-[1rem] rounded-lg border-primary-base">
        <img class="w-[40vw] h-auto" {src} alt="">
    </div>
    <h1 class="text-[1.4rem] font-semibold">{$_('storage.modal.scan_me')}</h1>
</Modal>

