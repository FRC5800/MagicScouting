<script>
// @ts-nocheck

    import QRCode from 'qrcode'
	import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n'
    import { goto } from '$app/navigation';
	import entriesSync from "../../lib/shared/stores/toSyncData";
    import dataBase from '$lib/shared/stores/dataBase';
	import Modal from '../Modal.svelte';
    
    let payload = {};
    let appData;
    
    let keys = ["team","match","arenaPos","red/blue","autoAmpScore","autoAmpMiss","autoSpeakerScore","autoSpeakerMiss","isLeave","teleopAmpScore","teleopAmpMiss","teleopSpeakerScore","teleopSpeakerMiss","speakerAmplifiedScore","trapStatus","onStageStatus","onStageTime","sourceCycleTime","floorCycleTime","highNoteStatus","matchFunction"]; 
    
    function getData(key){
        return localStorage.getItem(key);
    }

    onMount(() => {
        keys.forEach((key)=>{payload[key] = getData(key)});
        
        appData = JSON.stringify(Object.keys(payload).map(function(key){return payload[key]}));

        QRCode.toDataURL(appData, { errorCorrectionLevel: 'L' }, function (err, url) {src = url;})
    })

    var src = '';

    let showQrCode = false;
    let uploadStatus = 'Upload'
    let stored = false;
    let buttonColor;
    let uploadDisabled = false;
    let resetConfirmation = false;

    async function send_to_sheets(payload){
        console.log($dataBase + new URLSearchParams(payload))
        try{
            payload["sourceCycleTime"] = payload["sourceCycleTime"]=="" ? "0" : payload["sourceCycleTime"]
            payload["floorCycleTime"] = payload["floorCycleTime"]=="" ? "0" : payload["floorCycleTime"]

            let sourceTimes = payload["sourceCycleTime"].split(",").map((value) => {return value!="" ? parseFloat(value) : 0});
            let floorTimes = payload["floorCycleTime"].split(",").map((value) => {return value!="" ? parseFloat(value) : 0});

            let sourceAverage = sourceTimes.length > 0 ? sourceTimes.reduce((a, b) => a + b, 0) / sourceTimes.length : 0;
            let floorAverage = floorTimes.length > 0 ? floorTimes.reduce((a, b) => a + b, 0) / floorTimes.length : 0;
            
            return self.fetch($dataBase + new URLSearchParams(Object.assign({}, payload, {"sourceAverage": Math.round(sourceAverage*10)/10, "floorAverage":Math.round(floorAverage*10)/10})), {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },

            });
        }catch (e) {
            console.log(e);
            return {"text": ()=>{return JSON.stringify({"result": "Error"})}};
        }
    } 

    function updateQr() {
        QRCode.toDataURL(appData, { errorCorrectionLevel: 'L' }, function (err, url) {
        src = url;
    })
    } 

    async function HandleUpload(){
        uploadDisabled = true;
        let animation = setInterval(() => {uploadStatus = uploadStatus == "Uploading..." ? "Uploading" : uploadStatus == "Uploading.." ? "Uploading..." : uploadStatus == "Uploading." ? "Uploading.." :uploadStatus == "Uploading" ? "Uploading." : "Uploading...";}, 200);
        let response = JSON.parse(await send_to_sheets(payload).then((r) => {return r.text()}));
        clearInterval(animation)
        console.log(response)
        if (response.result == "success"){
            uploadStatus = 'Uploaded'
            buttonColor = "dark:bg-green-600 bg-green-600 dark:hover:bg-green-600";
        }else{
            uploadStatus = 'Failure';
            buttonColor = "dark:bg-red-600 bg-red-600 dark:hover:bg-red-600";
            HandleStore();   
        }
        
    } 

    function HandleStore(){
        let sameGame = false;
        $entriesSync.forEach((key) => {sameGame = (sameGame || (payload["team"] == key["team"] && payload["match"] == key["match"]))}) 
        if (!sameGame) {
            $entriesSync = $entriesSync.concat(payload); 
            console.log($entriesSync);
        }
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
<button class="min-w-[50vw] rounded-3xl m-0 w-fit {buttonColor} btn {stored ? 'disabled' : ''}" disabled={uploadDisabled ? true : stored ? true : false} on:click={HandleUpload}>{uploadStatus}</button>

<button disabled={uploadStatus == 'Uploaded' ? true : stored ? true : false} class="min-w-[50vw] rounded-3xl m-0 w-fit btn mt-8 {uploadStatus == 'Uploaded' ? 'disabled' : stored ? 'dark:bg-green-600 dark:text-white' : ''}" on:click={() => {stored = true; HandleStore()}}>{$_('qrcode.store_button')}</button>

<div class="w-[30vw] separator my-6"></div>

<button class="min-w-[50vw] rounded-3xl m-0 w-fit btn" on:click={HandleReset}>{$_('qrcode.finish_button')}</button>

{#if resetConfirmation}
    <Modal bind:showModal={resetConfirmation} showX={false}>
        <h2 class="text-2xl mb-2">{$_('qrcode.confirmation_modal.title')}</h2>
        <div class="flex flex-row justify-between box-border w-full border">
            <button on:click={() => {keys.forEach((key) => {localStorage.setItem(key, null)}); goto("/")}} class="w-[45%] p-2 shadow-md shadow-black bg-white active:shadow-inner text-black rounded-md">{$_('qrcode.confirmation_modal.yes_button')}</button>
            <button on:click={() => {resetConfirmation = false}} class="w-[45%] p-2 shadow-md shadow-black bg-white text-black rounded-md active:shadow-inner">{$_('qrcode.confirmation_modal.no_button')}</button>
        </div>
    </Modal>
{/if}

<style lang="postcss">
    .disabled{
        @apply bg-neutral-600 hover:bg-neutral-600 dark:bg-neutral-600 dark:hover:bg-neutral-600 hover:text-[#060024] dark:hover:text-[#060024];
    }

</style>