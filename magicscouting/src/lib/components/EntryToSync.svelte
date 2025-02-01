<script>
// @ts-nocheck
    import { _ } from "svelte-i18n";
    
    import Modal from '$lib/components/Modal.svelte';
    import teamImage from'$lib/assets/frc1156.png';
    import QRCode from "qrcode";
    import dataBase, { useDB } from "$lib/shared/stores/dataBase";
    import TrashCan from '$lib/components/TrashCan.svelte'
	import entriesSync from "../shared/stores/toSyncData";
    import uploadPayload from "../shared/scripts/sheetsUpload";

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
            let animation = setInterval(() => {buttonText = buttonText == "Uploading..." ? "Uploading" : buttonText == "Uploading.." ? "Uploading..." : buttonText == "Uploading." ? "Uploading.." :buttonText == "Uploading" ? "Uploading." : "Uploading...";}, 200);
            let response = JSON.parse(await uploadPayload(payload).then((r) => {return r.text()}));
            clearInterval(animation);
            console.log(response)
            if (response.result == "success"){
                buttonColor = "dark:bg-green-600 bg-green-600 ";
                HandleDelete();
                buttonText = "Uploaded";
                uploadSuccess = true;
            }else{
                buttonColor = "dark:bg-red-600 bg-red-600 ";
                buttonText = "Failed";
                uploadSuccess = false;
            }
        }catch(e){
            alert(e);
        }
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
    createQr()
</script>

<div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamImage} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Edit</li>
            <li on:keydown={(e) => {if(e.key == "Enter") HandleDelete()}} on:click={() => {HandleDelete(); $entriesSync = $entriesSync}}>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team 1156 - Under Control</h3>
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

