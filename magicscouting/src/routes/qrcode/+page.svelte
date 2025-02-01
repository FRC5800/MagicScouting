<script>
// @ts-nocheck
    import { _ } from 'svelte-i18n';
    import { App } from '@capacitor/app';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { useDB } from "$lib/shared/stores/dataBase";
    
    import QRCode from 'qrcode';
    import dataBase from '$lib/shared/stores/dataBase';
    import ResetModal from '$lib/components/ResetModal.svelte';
    import { entriesSync, syncedEntries } from "$lib/shared/stores/toSyncData";
    import uploadPayload from '$lib/shared/scripts/sheetsUpload';

    let payload = {};
    $: localData =  $entriesSync;
    let appData;
    
    let keys = [
        "team",
        "match",
        "arenaPos",
        "red/blue",
        "autoROneScore",
        "autoRTwoScore",
        "autoRThreeScore",
        "autoRFourScore",
        "autoROneMiss",
        "autoRTwoMiss",
        "autoRThreeMiss",
        "autoRFourMiss",
        "autoRemoveAlgaeLow",
        "autoRemoveAlgaeHigh",
        "autoProcessorScore", 
        "autoProcessorMiss", 
        "autoNetScore", 
        "autoNetMiss",
        "isLeave",
        "teleopROneScore",
        "teleopRTwoScore",
        "teleopRThreeScore",
        "teleopRFourScore",
        "teleopROneMiss",
        "teleopRTwoMiss",
        "teleopRThreeMiss",
        "teleopRFourMiss",
        "teleopRemoveAlgaeHigh",
        "teleopRemoveAlgaeLow",
        "teleopProcessorScore",
        "teleopProcessorMiss",
        "teleopNetScore",
        "teleopNetMiss",
        "bargeStatus",
        "bargeTime",
        "coralStationCycleTime",
        "coralFloorCycleTime",
        "algaeCycleTime",
        "robotFunction",
        "robotStatus",
        "coopBonus",
    ]; 
    
    var src = '';
    
    let showQrCode = false;
    let uploadStatus = 'Upload'
    let stored = false;
    let buttonColor;
    let uploadDisabled = false;
    let resetConfirmation = false;
    
    
    App.addListener("backButton", ()=>{resetConfirmation = true;});
    
    function getData(key){
        return localStorage.getItem(key);
    }
    
    onMount(() => {
        keys.forEach((key)=>{payload[key] = getData(key)});
        
        payload["uploaded"] = false

        appData = JSON.stringify(Object.keys(payload).map(function(key){return payload[key]}));
    
        QRCode.toDataURL(appData, { errorCorrectionLevel: 'L' }, function (err, url) {src = url;})
    })
    
    function avgArray(arr){
        let sum = 0;
        arr.forEach((n) => {sum+=n});
        return arr.length > 0 ? sum/arr.length : 0;
    }
    
    function updateQr() {
        QRCode.toDataURL(appData, { errorCorrectionLevel: 'L' }, function (err, url) {
        src = url;
    })
} 


async function HandleUpload(){
        uploadDisabled = true;

        let dotsAnimation = "";
        let animation = setInterval(() => {dotsAnimation = dotsAnimation == "..." ? "" : dotsAnimation == ".." ? "..." : dotsAnimation == "." ? ".." :dotsAnimation == "" ? "." : "..."; uploadStatus = "Uploading" + dotsAnimation}, 200);
        
        let response = JSON.parse(await uploadPayload(payload).then((r) => {return r.text()}));
        
        clearInterval(animation)
        
        console.log(response)
        
        if (response.result == "success"){
            payload.uploaded = true
            $syncedEntries.push(payload)
            console.log($syncedEntries)
            uploadStatus = 'Uploaded'
            buttonColor = "dark:bg-green-600 bg-green-600 dark:hover:bg-green-600";
        }else{
            uploadStatus = 'Failure';
            buttonColor = "dark:bg-red-600 bg-red-600 dark:hover:bg-red-600";
            HandleStore();
        }
        
    } 

    function CheckRepeatedGame(newGame, games){
        games.forEach((item) => {
            if (newGame["team"] == item["team"] && newGame["match"] == item["match"]){
                return true;
            }
        })
        return false;
    }

    function HandleStore(){
        if (!CheckRepeatedGame(payload, $entriesSync)) {
            $entriesSync = $entriesSync.concat(payload); 
        } else{
            console.log('repeated entry');
        }
        payload = {};
    }

    function HandleReset(){
        if (uploadDisabled == false && stored == false){
            resetConfirmation = true;
            console.log(resetConfirmation)
        }else {
            keys.forEach((key) => {localStorage.setItem(key, null)});
            goto("/")
        }
    }
</script>

<div on:input={updateQr} class="box-border h-auto break-words p-4 rounded-lg w-[70vw] text-[#EAEAEC] bg-grey-heavy mt-4">{appData}</div>

<span class="mt-4">(Offline)</span>
<button on:click={() => {showQrCode = !showQrCode}} disabled={uploadStatus == 'Uploaded' ? true : stored ? true : false} class="transition-none {showQrCode ? 'dark:text-white rounded-b-none dark:border-0 dark:bg-buttons' : ''} min-w-[50vw] rounded-3xl border-0 m-0 w-fit btn {uploadStatus == 'Uploaded' ? 'disabled' : stored ? 'disabled' : ''}">
    {$_('qrcode.qrcode_button')}
</button>

{#if (showQrCode)}
    <div class="qrCode-container min-w-[50vw] flex flex-row justify-center bg-white w-fit rounded-b-3xl">
        <img class="w-[70%] h-auto" {src} alt="A Qr Code">
    </div>
{/if}

{#if !(uploadStatus == 'Uploaded' || stored)}
    <i role="button" tabindex="0" on:keydown={(e) => {showQrCode = e.key == "Enter" ? !showQrCode : showQrCode}} on:click={() => {showQrCode = !showQrCode}} class="fa-solid fa-chevron-down {showQrCode ? 'transform rotate-180' : '' }"></i>    
{/if}

<span class="m-2">{$_('qrcode.or')}</span>

<span >(Online)</span>
<button class="min-w-[50vw] rounded-3xl m-0 w-fit {buttonColor} btn {stored || !$useDB ? 'disabled' : ''}" disabled={uploadDisabled || !$useDB || stored ? true : false} on:click={HandleUpload}>{uploadStatus}</button>

<button disabled={uploadStatus == 'Uploaded' ? true : stored ? true : false} class="min-w-[50vw] rounded-3xl m-0 w-fit btn mt-8 {uploadStatus == 'Uploaded' ? 'disabled' : stored ? 'dark:bg-green-600 dark:text-white' : ''}" on:click={() => {stored = true; HandleStore()}}>{$_('qrcode.store_button')}</button>

<div class="w-[30vw] separator my-6"></div>

<button class="min-w-[50vw] rounded-3xl m-0 w-fit btn" on:click={HandleReset}>{$_('qrcode.finish_button')}</button>

<ResetModal bind:resetConfirmation={resetConfirmation}/>

<style lang="postcss">
    .disabled{
        @apply bg-neutral-600 hover:bg-neutral-600 dark:bg-neutral-600 dark:hover:bg-neutral-600 hover:text-[#060024] dark:hover:text-[#060024];
    }

</style>

