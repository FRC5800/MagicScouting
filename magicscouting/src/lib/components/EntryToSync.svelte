<script>
// @ts-nocheck

    import QRCode from "qrcode";
    import TrashCan from '$lib/components/TrashCan.svelte'
    import Modal from '../../routes/Modal.svelte';
	import entriesSync from "../shared/stores/toSyncData";
    import { _ } from "svelte-i18n";
    import dataBase from "$lib/shared/stores/dataBase";

    export let payload = {"team":5800, "match":2};
    let src = ''

    let showQrCode = false
    async function send_to_sheets(payload){
        console.log($dataBase + new URLSearchParams(payload))
        try{
            payload["sourceCycleTime"] = payload["sourceCycleTime"]=="" ? "0" : payload["sourceCycleTime"]
            payload["floorCycleTime"] = payload["floorCycleTime"]=="" ? "0" : payload["floorCycleTime"]

            let sourceTimes = payload["sourceCycleTime"].split(",").map((value) => {return value!="" ? parseFloat(value) : 0});
            let floorTimes = payload["floorCycleTime"].split(",").map((value) => {return value!="" ? parseFloat(value) : 0});

            let sourceAverage = sourceTimes.length > 0 ? sourceTimes.reduce((a, b) => a + b, 0) / sourceTimes.length : 0;
            let floorAverage = floorTimes.length > 0 ? floorTimes.reduce((a, b) => a + b, 0) / floorTimes.length : 0;
            
            return self.fetch($dataBase + new URLSearchParams(Object.assign({}, payload, {"sourceAverage": Math.round(sourceAverage*10)/10, "floorAverage":Math.round(floorAverage*10)/10})),{
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },

            });
        }catch (e) {
            return false;
        }
    }   
    let buttonColor = ""
    let uploadDisabled = false;
    let uploadSuccess = 'undefined';
    let buttonText = "Upload";
    async function HandleUpload(){
        try{
            uploadDisabled = true;
            let animation = setInterval(() => {buttonText = buttonText == "Uploading..." ? "Uploading" : buttonText == "Uploading.." ? "Uploading..." : buttonText == "Uploading." ? "Uploading.." :buttonText == "Uploading" ? "Uploading." : "Uploading...";}, 200);
            let response = JSON.parse(await send_to_sheets(payload).then((r) => {return r.text()}));
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

<section class="flex flex-row w-full shadow-sm shadow-primary-light bg-gray-300 dark:bg-gray-700 p-1 rounded-md border-b-2 mb-4">
    <div class="pr-3 border-r border-grey-heavy w-fit flex items-center justify-center">
        <i {src} alt="A Qr Code"  class="fa-solid fa-qrcode {uploadSuccess === true ? 'text-green-600' : uploadSuccess === false ? 'text-red-600' : ''} text-[100px]"></i>
    </div>

    <div class="flex flex-col items-start justify-between w-full ml-3 overflow-auto">
        
        <div class="flex flex-row justify-around w-full text-lg">
            <h1 class="text-2xl">{$_('storage.team')}: {payload.team}</h1>
            <h1 class="text-2xl">{$_('storage.match')}: {payload.match}</h1>
        </div>
        
        <div class="w-full p-2 overflow-hidden overflow-x-auto rounded-lg text-gray-300 bg-grey-heavy">{JSON.stringify(payload)}</div>

        <div class="flex flex-row items-center justify-around w-full">
            <button class="p-3 btn w-fit h-fit text-xs {buttonColor}" disabled={uploadDisabled}  on:click={HandleUpload}>{buttonText}</button>
            <button class="p-3 btn w-fit h-fit text-xs" on:click={() => {showQrCode = true}}>Escanear</button>
            <TrashCan scale={0.7} on:keydown={(e) => {if(e.key == "Enter") HandleDelete()}} on:click={() => {HandleDelete(); $entriesSync = $entriesSync}}/>
        </div>
    </div>
</section>

<Modal bind:showModal={showQrCode}> 
    <h1 class="text-[1.8rem] font-semibold">{$_('storage.modal.title')}</h1>
    <div class="flex items-center justify-center border-[1rem] rounded-lg border-primary-base">
        <img class="w-[40vw] h-auto" {src} alt="">
    </div>
    <h1 class="text-[1.4rem] font-semibold">{$_('storage.modal.scan_me')}</h1>
</Modal>

