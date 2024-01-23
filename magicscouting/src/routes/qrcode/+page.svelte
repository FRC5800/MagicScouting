<script>
// @ts-nocheck

    import QRCode from 'qrcode'
	import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n'
    import { goto } from '$app/navigation';
	import entriesSync from "../../lib/shared/stores/toSyncData";
    
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

    async function send_to_sheets(payload){
        console.log("https://script.google.com/macros/s/AKfycbwuJXjCSjgDuAy4ncpD7NfNWKzuwsbuuTBWWfgvSBqS5jnr1iqz0UZ6pSfoxsJhMSgW/exec?" + new URLSearchParams(payload))
        try{
            // return self.fetch('https://corsproxy.io/?' + encodeURIComponent("https://script.google.com/macros/s/AKfycbwuJXjCSjgDuAy4ncpD7NfNWKzuwsbuuTBWWfgvSBqS5jnr1iqz0UZ6pSfoxsJhMSgW/exec?" + new URLSearchParams(payload)),{
            return self.fetch("https://script.google.com/macros/s/AKfycbwuJXjCSjgDuAy4ncpD7NfNWKzuwsbuuTBWWfgvSBqS5jnr1iqz0UZ6pSfoxsJhMSgW/exec?" + new URLSearchParams(payload),{
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },

            });
        }catch (e) {
            return false;
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
        keys.forEach((key) => {localStorage.setItem(key, null)});
        goto("/")
    }
</script>

<textarea on:input={updateQr} bind:value={appData} class="box-border resize-none p-4 rounded-lg w-[70vw] text-[#EAEAEC] bg-grey-heavy mt-4"></textarea>

<span class="mt-4">(Offline)</span>
<button on:click={() => {showQrCode = !showQrCode}} disabled={uploadStatus == 'Uploaded' ? true : stored ? true : false} class="transition-none {showQrCode ? 'dark:text-white rounded-b-none dark:border-0 dark:bg-buttons' : ''} min-w-[50vw] rounded-3xl border-0 m-0 w-fit btn {uploadStatus == 'Uploaded' ? 'dark:bg-neutral-600 dark:hover:bg-neutral-600 dark:hover:text-[#060024]' : stored ? 'dark:bg-neutral-600 dark:hover:bg-neutral-600 dark:hover:text-[#060024]' : ''}">
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

<span class="m-4">{$_('qrcode.or')}</span>

<span >(Online)</span>
<button class="min-w-[50vw] rounded-3xl m-0 w-fit {buttonColor} btn {stored ? 'dark:bg-neutral-600 dark:hover:bg-neutral-600 dark:hover:text-[#060024]' : ''}" disabled={uploadDisabled ? true : stored ? true : false} on:click={HandleUpload}>{$_('qrcode.upload_button')}</button>

<button disabled={uploadStatus == 'Uploaded' ? true : stored ? true : false} class="min-w-[50vw] rounded-3xl m-0 w-fit btn mt-8 {uploadStatus == 'Uploaded' ? 'dark:bg-neutral-600 dark:hover:bg-neutral-600 dark:hover:text-[#060024]' : stored ? 'dark:bg-green-600 dark:text-white' : ''}" on:click={() => {stored = true; HandleStore()}}>Store</button>

<div class="w-[30vw] separator my-8"></div>

<button class="min-w-[50vw] rounded-3xl m-0 w-fit btn" on:click={HandleReset}>{$_('qrcode.finish_button')}</button>

<style>
</style>