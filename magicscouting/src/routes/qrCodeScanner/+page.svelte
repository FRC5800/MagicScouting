<script>
// @ts-nocheck

    import { _ } from 'svelte-i18n'
    import { App } from '@capacitor/app';
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
    
    import Modal from '$lib/components/Modal.svelte';
	import entriesSync from "../../lib/shared/stores/toSyncData";

    
    $: App.addListener("backButton", ()=>{showModal=false; if (!scanning) {goto('/')} else {stopScan()}});

    let scanning = false;
    let data = {};
    let stored = '';
    $: showModal = false;
    $: console.log(showModal)

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
    let showModal = false;
    
    const requestPermissions = async () => {
    	await BarcodeScanner.requestPermissions();
    };
    
    onMount(() => {
        requestPermissions();
    })
    
    function QrCodeToPayload(qrcode){
        let payload = {};
        
        for (let i = 0; i < keys.length; i++){
            payload[keys[i]] = JSON.parse(qrcode)[i];
        }

        return payload;
    }

    const startScan = async () => {
        document.querySelector("body")?.classList.add("barcode-scanning-active");
        document.querySelector("html")?.classList.add("barcode-scanning-active");
        scanning = true;
        
        await BarcodeScanner.addListener(
            "barcodeScanned",
            async (result) => {                
                await stopScan();

                if (JSON.parse(result.barcode.displayValue).length != keys.length){
                    alert("Invalid QR code");
                }else{
                    data = QrCodeToPayload(result.barcode.displayValue);
                    showModal = true;
                }
            });
        await BarcodeScanner.startScan();
    };
    
    const stopScan = async () => {
        document.querySelector("body")?.classList.remove("barcode-scanning-active");
        document.querySelector("html")?.classList.remove("barcode-scanning-active");
        scanning = false;
        goto('/');
        await BarcodeScanner.removeAllListeners();
        
        await BarcodeScanner.stopScan();
        
    };
    

    function CheckRepeatedGame(newGame, games){
        games.forEach((item) => {
            if (newGame["team"] == item["team"] && newGame["match"] == item["match"]){
                return true;
            }
        })
        return false;
    }

    function HandleStore(callbackSuccess = ()=>{}, callbackRepeated = ()=>{}){
        if (!CheckRepeatedGame(data, $entriesSync)) {
            $entriesSync = $entriesSync.concat(data); 
            console.log($entriesSync);
            callbackSuccess();
        }else{
            callbackRepeated();
        }
        data = {};
    }

    startScan();
</script>

{#if scanning}
    <svg xmlns="http://www.w3.org/2000/svg" class="fixed top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] visible" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" zoomAndPan="magnify" viewBox="0 0 112.5 112.499997" height="200" preserveAspectRatio="xMidYMid meet" version="1.0">
        <defs><clipPath id="55a0b52d50"><path d="M 0 0 L 112.003906 0 L 112.003906 112.003906 L 0 112.003906 Z M 0 0 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#55a0b52d50)"><path fill="#FFFFFF" d="M 33.226562 2.667969 C 33.226562 3.019531 33.160156 3.359375 33.023438 3.6875 C 32.890625 4.015625 32.695312 4.300781 32.445312 4.550781 C 32.195312 4.800781 31.90625 4.996094 31.582031 5.128906 C 31.253906 5.265625 30.914062 5.332031 30.5625 5.332031 L 5.332031 5.332031 L 5.332031 34.027344 C 5.332031 34.382812 5.265625 34.722656 5.128906 35.046875 C 4.996094 35.375 4.800781 35.664062 4.550781 35.914062 C 4.300781 36.164062 4.015625 36.355469 3.6875 36.492188 C 3.359375 36.625 3.019531 36.695312 2.667969 36.695312 C 2.3125 36.695312 1.972656 36.625 1.644531 36.492188 C 1.320312 36.355469 1.03125 36.164062 0.78125 35.914062 C 0.53125 35.664062 0.339844 35.375 0.203125 35.046875 C 0.0664062 34.722656 0 34.382812 0 34.027344 L 0 2.667969 C 0 2.3125 0.0664062 1.972656 0.203125 1.644531 C 0.339844 1.320312 0.53125 1.03125 0.78125 0.78125 C 1.03125 0.53125 1.320312 0.339844 1.644531 0.203125 C 1.972656 0.0664062 2.3125 0 2.667969 0 L 30.5625 0 C 30.914062 0 31.253906 0.0664062 31.582031 0.203125 C 31.90625 0.339844 32.195312 0.53125 32.445312 0.78125 C 32.695312 1.03125 32.890625 1.320312 33.023438 1.644531 C 33.160156 1.972656 33.226562 2.3125 33.226562 2.667969 Z M 29.601562 106.667969 L 5.332031 106.667969 L 5.332031 77.066406 C 5.332031 76.714844 5.265625 76.375 5.128906 76.046875 C 4.996094 75.722656 4.800781 75.433594 4.550781 75.183594 C 4.300781 74.933594 4.015625 74.738281 3.6875 74.605469 C 3.359375 74.46875 3.019531 74.402344 2.667969 74.402344 C 2.3125 74.402344 1.972656 74.46875 1.644531 74.605469 C 1.320312 74.738281 1.03125 74.933594 0.78125 75.183594 C 0.53125 75.433594 0.339844 75.722656 0.203125 76.046875 C 0.0664062 76.375 0 76.714844 0 77.066406 L 0 109.335938 C 0 109.6875 0.0664062 110.027344 0.203125 110.355469 C 0.339844 110.683594 0.53125 110.972656 0.78125 111.222656 C 1.03125 111.472656 1.320312 111.664062 1.644531 111.800781 C 1.972656 111.933594 2.3125 112.003906 2.667969 112.003906 L 29.601562 112.003906 C 29.953125 112.003906 30.292969 111.933594 30.621094 111.800781 C 30.949219 111.664062 31.234375 111.472656 31.484375 111.222656 C 31.734375 110.972656 31.929688 110.683594 32.0625 110.355469 C 32.199219 110.027344 32.265625 109.6875 32.265625 109.335938 C 32.265625 108.980469 32.199219 108.640625 32.0625 108.316406 C 31.929688 107.988281 31.734375 107.699219 31.484375 107.449219 C 31.234375 107.199219 30.949219 107.007812 30.621094 106.871094 C 30.292969 106.738281 29.953125 106.667969 29.601562 106.667969 Z M 109.601562 74.082031 C 109.25 74.082031 108.910156 74.148438 108.582031 74.285156 C 108.253906 74.417969 107.964844 74.613281 107.714844 74.863281 C 107.464844 75.113281 107.273438 75.402344 107.136719 75.726562 C 107.003906 76.054688 106.933594 76.394531 106.933594 76.75 L 106.933594 106.667969 L 77.921875 106.667969 C 77.566406 106.667969 77.226562 106.738281 76.902344 106.871094 C 76.574219 107.007812 76.285156 107.199219 76.035156 107.449219 C 75.785156 107.699219 75.59375 107.988281 75.457031 108.316406 C 75.324219 108.640625 75.253906 108.980469 75.253906 109.335938 C 75.253906 109.6875 75.324219 110.027344 75.457031 110.355469 C 75.59375 110.683594 75.785156 110.972656 76.035156 111.222656 C 76.285156 111.472656 76.574219 111.664062 76.902344 111.800781 C 77.226562 111.933594 77.566406 112.003906 77.921875 112.003906 L 109.335938 112.003906 C 109.6875 112.003906 110.027344 111.933594 110.355469 111.800781 C 110.683594 111.664062 110.972656 111.472656 111.222656 111.222656 C 111.472656 110.972656 111.664062 110.683594 111.800781 110.355469 C 111.933594 110.027344 112.003906 109.6875 112.003906 109.335938 L 112.003906 76.75 C 112.003906 76.394531 111.933594 76.054688 111.800781 75.726562 C 111.664062 75.402344 111.472656 75.113281 111.222656 74.863281 C 110.972656 74.613281 110.683594 74.417969 110.355469 74.285156 C 110.027344 74.148438 109.6875 74.082031 109.335938 74.082031 Z M 109.335938 0 L 76.375 0 C 76.019531 0 75.679688 0.0664062 75.355469 0.203125 C 75.027344 0.339844 74.738281 0.53125 74.488281 0.78125 C 74.238281 1.03125 74.046875 1.320312 73.910156 1.644531 C 73.777344 1.972656 73.707031 2.3125 73.707031 2.667969 C 73.707031 3.019531 73.777344 3.359375 73.910156 3.6875 C 74.046875 4.015625 74.238281 4.300781 74.488281 4.550781 C 74.738281 4.800781 75.027344 4.996094 75.355469 5.128906 C 75.679688 5.265625 76.019531 5.332031 76.375 5.332031 L 106.667969 5.332031 L 106.667969 34.988281 C 106.667969 35.339844 106.738281 35.679688 106.871094 36.007812 C 107.007812 36.335938 107.199219 36.621094 107.449219 36.871094 C 107.699219 37.125 107.988281 37.316406 108.316406 37.449219 C 108.640625 37.585938 108.980469 37.652344 109.335938 37.652344 C 109.6875 37.652344 110.027344 37.585938 110.355469 37.449219 C 110.683594 37.316406 110.972656 37.125 111.222656 36.871094 C 111.472656 36.621094 111.664062 36.335938 111.800781 36.007812 C 111.933594 35.679688 112.003906 35.339844 112.003906 34.988281 L 112.003906 2.667969 C 112.003906 2.3125 111.933594 1.972656 111.800781 1.644531 C 111.664062 1.320312 111.472656 1.03125 111.222656 0.78125 C 110.972656 0.53125 110.683594 0.339844 110.355469 0.203125 C 110.027344 0.0664062 109.6875 0 109.335938 0 Z M 109.335938 0 " fill-opacity="1" fill-rule="nonzero"/></g>
    </svg>

    <button on:click={stopScan} class="btn visible absolute bottom-[10%] w-[60%]">{$_('scanner.stop_button')}</button>
{/if}

    <Modal showModal={showModal} showX={false}>
        {#if stored == ''}
            <h2 class="mb-2 text-2xl">{$_('scanner.confirmation_modal.title')}</h2>
            <div class="box-border flex flex-row justify-between w-full">
                <button on:click={() => {HandleStore(() => {stored = 'success'; setTimeout(() => {stored = ''; showModal = false}, 1000)}, () => {stored = 'failure'; setTimeout(() => {stored = ''; showModal = false}, 1000)})}} class="w-[45%] p-2 shadow-md shadow-black bg-white active:shadow-inner text-black rounded-md">{$_('scanner.confirmation_modal.option_yes')}</button>
                <button on:click={() => {showModal = false; console.log(showModal)}} class="w-[45%] p-2 shadow-md shadow-black bg-white text-black rounded-md active:shadow-inner">{$_('scanner.confirmation_modal.option_no')}</button>
            </div>
        {:else if stored == 'success'}
            <h2 class="mb-2 text-2xl text-green-500">{$_('scanner.confirmation_modal.success_alert')}</h2>
        {:else if stored == 'failure'}
        <h2 class="mb-2 text-2xl text-red-500">{$_('scanner.confirmation_modal.title.failure_alert')}</h2>
        {/if}
    </Modal>

<style lang="postcss">

</style>