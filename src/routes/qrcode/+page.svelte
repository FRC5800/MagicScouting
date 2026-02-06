<!-- @migration-task Error while migrating Svelte code: `<th>` cannot be a child of `<thead>`. `<thead>` only allows these children: `<tr>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script>
// @ts-nocheck
import { _ } from 'svelte-i18n';
import { App } from '@capacitor/app';
import { goto, beforeNavigate } from '$app/navigation';
import { onMount } from 'svelte';
import { useDB } from "$lib/shared/stores/dataBase";

import QRCode from 'qrcode';
import ResetModal from '$lib/components/ResetModal.svelte';
import { entriesSync, syncedEntries } from "$lib/shared/stores/toSyncData";
import uploadPayload from '$lib/shared/scripts/sheetsUpload';

import { keys, getFieldType } from '$lib/shared/stores/gameKeys';

let payload = $state({});
let visualAppData;

let src = $state('');

let showQrCode = $state(false);
let uploadStatus = $state('Upload');
let stored = $state(false);
let buttonColor = $state('');
let uploadDisabled = $state(false);
let resetConfirmation = $state(false);


App.addListener("backButton", ()=>{goto("/")});
beforeNavigate(({ to, cancel }) => {
		if (uploadDisabled == false && stored == false) {
			if (!confirm("Do you really want to reset the app?")) {
      			cancel();
    		} else {
                keys.forEach((key) => {localStorage.setItem(key, null)});
            }
    	}
  	});

function getData(key){
    return localStorage.getItem(key);
}

// Determine field type for proper editing


// Update payload value and refresh QR code
function updatePayloadValue(key, value) {
    payload[key] = value;
    updateVisualData();
    updateQr();
}

function updateVisualData() {
    visualAppData = JSON.stringify(Object.keys(payload).map(function(key){return payload[key]}));
}

onMount(() => {
    const initialPayload = {};
    keys.forEach((key)=>{initialPayload[key] = getData(key)});
    initialPayload["uploaded"] = false;
    payload = initialPayload;

    updateVisualData();

    QRCode.toDataURL(visualAppData, { errorCorrectionLevel: 'L' }, function (err, url) {src = url;})
})

function updateQr() {
    updateVisualData();
    QRCode.toDataURL(visualAppData, { errorCorrectionLevel: 'L' }, function (err, url) {
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
    showQrCode = false;
}

function CheckRepeatedGame(newGame, games){
    games.forEach((item) => {
        if (newGame["teamNumber"] == item["teamNumber"] && newGame["matchNumber"] == item["matchNumber"]){
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
    showQrCode = false;
}

function HandleReset(){
    goto("/");
}
</script>

<div class="box-border h-auto break-words p-2 w-full max-w-full max-h-52 overflow-y-scroll rounded-lg text-[#EAEAEC] bg-grey-heavy mt-4 overflow-x-auto">
    <table class="table w-full">
        <thead>
            <tr>
                <th class="text-white">Field</th>
                <th class="text-white">Value</th>
            </tr>
        </thead>
        <tbody>
            {#each Object.keys(payload).filter((a) => a != "uploaded") as key}
                {@const fieldType = getFieldType(key)}
                <tr>
                    <th class="whitespace-nowrap">{key}</th>
                    <td class="w-full">
                        {#if fieldType === 'number'}
                            <input
                                type="number"
                                min="0"
                                bind:value={payload[key]}
                                oninput={(e) => {
                                    if (e.target.value < 0) e.target.value = 0;
                                    updateQr();
                                }}
                                class="editable-input"
                            />
                        {:else if fieldType === 'boolean'}
                            <input
                                type="checkbox"
                                checked={payload[key] === 1 || payload[key] === '1'}
                                onchange={(e) => {
                                    payload[key] = e.target.checked ? 1 : 0;
                                    updateQr();
                                }}
                                class="editable-checkbox"
                            />
                        {:else if fieldType === 'select'}
                            {#if key === 'robotStatus'}
                                <select
                                    value={payload[key] || 'safe'}
                                    onchange={(e) => {
                                        payload[key] = e.target.value;
                                        updateQr();
                                    }}
                                    class="editable-select"
                                >
                                    <option value="safe">Safe</option>
                                    <option value="broke">Broke</option>
                                    <option value="commLoss">Communication Loss</option>
                                </select>
                            {:else if key === 'robotFunction'}
                                <select
                                    value={payload[key] || 'score'}
                                    onchange={(e) => {
                                        payload[key] = e.target.value;
                                        updateQr();
                                    }}
                                    class="editable-select"
                                >
                                    <option value="score">Score</option>
                                    <option value="feed">Feed</option>
                                    <option value="defense">Deffense</option>
                                </select>
                            {:else if key === 'red/blue'}
                                <select
                                    value={payload[key] || 'BLUE'}
                                    onchange={(e) => {
                                        payload[key] = e.target.value;
                                        updateQr();
                                    }}
                                    class="editable-select"
                                >
                                    <option value="RED">RED</option>
                                    <option value="BLUE">BLUE</option>
                                </select>
                            {:else if key === 'teleopClimb'}
                                <select
                                    value={payload[key] || 'No Climb'}
                                    onchange={(e) => {
                                        payload[key] = e.target.value;
                                        updateQr();
                                    }}
                                    class="editable-select"
                                >
                                    <option value="none">No Climb</option>
                                    <option value="L1">L1</option>
                                    <option value="L2">L2</option>
                                    <option value="L3">L3</option>
                                </select>
                            {:else if key === 'arenaPosNumber'}
                                <select
                                    value={payload[key] || '1'}
                                    onchange={(e) => {
                                        payload[key] = e.target.value;
                                        updateQr();
                                    }}
                                    class="editable-select"
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            {/if}
                        {:else}
                            <input
                                type="text"
                                bind:value={payload[key]}
                                oninput={() => updateQr()}
                                class="editable-input"
                            />
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<span class="mt-4">(Offline)</span>
<button onclick={() => {showQrCode = !showQrCode}} disabled={uploadStatus == 'Uploaded' ? true : stored ? true : false} class="transition-none {showQrCode ? 'dark:text-white rounded-b-none dark:border-0 dark:bg-buttons' : ''} min-w-[50vw] border-0 m-0 btn btn-block {uploadStatus == 'Uploaded' ? 'disabled' : stored ? 'disabled' : ''}">
    {$_('qrcode.qrcode_button')}
</button>

{#if (showQrCode)}
    <div class="qrCode-container min-w-[50vw] w-full flex flex-row justify-center bg-white w-fit rounded-b-3xl">
        <img class="w-[70%] h-auto" {src} alt="A Qr Code">
    </div>
{/if}

{#if !(uploadStatus == 'Uploaded' || stored)}
    <i role="button" tabindex="0" onkeydown={(e) => {showQrCode = e.key == "Enter" ? !showQrCode : showQrCode}} onclick={() => {showQrCode = !showQrCode}} class="fa-solid fa-chevron-down {showQrCode ? 'transform rotate-180' : '' }"></i>
{/if}

<span class="m-2">{$_('qrcode.or')}</span>

<span >(Online)</span>
<button class=" m-0 {buttonColor} btn btn-block {stored || !$useDB ? 'disabled' : ''}" disabled={uploadDisabled || !$useDB || stored ? true : false} onclick={HandleUpload}>{uploadStatus}</button>

<button disabled={uploadStatus == 'Uploaded' ? true : stored ? true : false} class=" m-0 btn btn-block mt-8 {uploadStatus == 'Uploaded' ? 'disabled text-primary-heavy' : stored ? 'stored' : ''}" onclick={() => {stored = true; HandleStore()}}>{$_('qrcode.store_button')}</button>

<div class="w-[30vw] separator my-6"></div>

<button class="w-full m-0 btn btn-primary hover:bg-primary-base bg-buttons border-buttons" onclick={HandleReset}>{$_('qrcode.finish_button')}</button>

<ResetModal bind:resetConfirmation={resetConfirmation}/>

<style lang="postcss">
    .disabled{
        @apply bg-neutral-600 text-gray-400 hover:bg-neutral-600 dark:bg-neutral-600 dark:hover:bg-neutral-600 hover:text-[#060024] dark:hover:text-[#060024];
    }
    .stored{
        @apply bg-green-600 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-600 text-[#E0E0E0] hover:text-[#E0E0E0] dark:hover:text-[#E0E0E0];
    }

    .editable-input {
        @apply bg-transparent border border-primary-base rounded px-2 py-1 text-[#EAEAEC] dark:text-white;
        width: 100%;
        max-width: 200px;
    }

    .editable-input:focus {
        @apply outline-none border-primary-light ring-2 ring-primary-light;
    }

    .editable-checkbox {
        @apply w-5 h-5 cursor-pointer;
        accent-color: var(--color-primary-base);
    }

    .editable-select {
        @apply bg-transparent border border-primary-base rounded px-2 py-1 text-[#EAEAEC] dark:text-white cursor-pointer;
        width: 100%;
        max-width: 200px;
    }

    .editable-select:focus {
        @apply outline-none border-primary-light ring-2 ring-primary-light;
    }

    .editable-select option {
        @apply bg-grey-heavy text-white;
    }

</style>
