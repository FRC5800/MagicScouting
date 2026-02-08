<script>
    // @ts-nocheck
    import { run } from 'svelte/legacy';

    import { _ } from "svelte-i18n";

    import Modal from '$lib/components/Modal.svelte';
    import QRCode from "qrcode";
	import { entriesSync, syncedEntries } from "../shared/stores/toSyncData";
    import uploadPayload from "../shared/scripts/sheetsUpload";
    import { getDefaultLogo, getTBAData } from "$lib/shared/scripts/chartUtilities";
    import { onMount } from "svelte";
	import Toast from "./Toast.svelte";
	import { useDB } from '$lib/shared/stores/dataBase';


    let { payload = $bindable({"teamNumber":5800, "matchNumber":2}), index } = $props();

    let src = $state('')
    let showEditModal = $state(false);
    let editedPayload = $state({});

    let showQrCode = false
    run(() => {
        console.log(showQrCode)
    });

    // Field keys for type detection
    //
    import { getFieldType } from '$lib/shared/stores/gameKeys';

    // Determine field type for proper editing


    function openEditModal() {
        // Create a deep copy of the payload for editing
        editedPayload = JSON.parse(JSON.stringify(payload));
        document.getElementById('entry_edit_'+index).showModal();
    }

    function saveEdit() {
        // Update the original payload
        Object.keys(editedPayload).forEach(key => {
            payload[key] = editedPayload[key];
        });
        // Update the store to trigger reactivity
        const currentIndex = $entriesSync.indexOf(payload);
        if (currentIndex !== -1) {
            $entriesSync[currentIndex] = payload;
            $entriesSync = [...$entriesSync];
        }
        // Regenerate QR code
        createQr();
        showEditModal = false;
    }

    function updateEditedValue(key, value) {
        editedPayload[key] = value;
    }

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
        getTBAData(payload.teamNumber).then((r) => {
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
                <li onkeydown={(e) => {if(e.key == "Enter") openEditModal()}} onclick={() => {openEditModal()}}><a href="">{$_("misc.edit_button")}</a></li>
                <li onkeydown={(e) => {if(e.key == "Enter") HandleDelete()}} onclick={() => {HandleDelete()}}><a href="">{$_('misc.delete_button')}</a></li>
            </ul>
        </div>
        <h3 class="ml-10 text-lg">Team {payload.teamNumber} - {teamData.name ?? ""}</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>{$_('storage.match')}: {payload.matchNumber}</span>
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

<dialog id={"entry_edit_"+index} class="modal">
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

       <div class="edit-modal-container">
        <h2 class="edit-modal-title">{$_("misc.edit_table")}</h2>
        <div class="table-container">
            <table class="edit-table">
                <thead>
                    <tr>
                        <th>{$_("misc.field")}</th>
                        <th>{$_("misc.value")}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each Object.keys(editedPayload).filter((a) => a != "uploaded") as key}
                        {@const fieldType = getFieldType(key)}
                        <tr>
                            <th class="whitespace-nowrap overflow-auto">{key}</th>
                            <td class="w-full">
                                {#if fieldType === 'number'}
                                    <input
                                        type="number"
                                        min="0"
                                        bind:value={editedPayload[key]}
                                        oninput={(e) => {
                                            if (e.target.value < 0) e.target.value = 0;
                                            createQr();
                                        }}
                                        class="editable-input"
                                    />
                                {:else if fieldType === 'boolean'}
                                    <input
                                        type="checkbox"
                                        checked={editedPayload[key] === 1 || editedPayload[key] === '1'}
                                        onchange={(e) => {
                                            editedPayload[key] = e.target.checked ? 1 : 0;
                                            createQr();
                                        }}
                                        class="editable-checkbox"
                                    />
                                {:else if fieldType === 'select'}
                                    {#if key === 'robotStatus'}
                                        <select
                                            value={editedPayload[key] || 'safe'}
                                            onchange={(e) => {
                                                editedPayload[key] = e.target.value;
                                                createQr();
                                            }}
                                            class="editable-select"
                                        >
                                            <option value="safe">{$_('info.safe')}</option>
                                            <option value="broke">{$_('info.broke')}</option>
                                            <option value="commLoss">{$_('info.communication_fault')}</option>
                                        </select>
                                    {:else if key === 'robotFunction'}
                                        <select
                                            value={editedPayload[key] || 'score'}
                                            onchange={(e) => {
                                                editedPayload[key] = e.target.value;
                                                createQr();
                                            }}
                                            class="editable-select"
                                        >
                                            <option value="score">{$_("info.attack")}</option>
                                            <option value="feed">{$_("info.support")}</option>
                                            <option value="defense">{$_("info.defense")}</option>
                                        </select>
                                    {:else if key === 'red/blue'}
                                        <select
                                            value={editedPayload[key] || 'BLUE'}
                                            onchange={(e) => {
                                                editedPayload[key] = e.target.value;
                                                createQr();
                                            }}
                                            class="editable-select"
                                        >
                                            <option value="RED">RED</option>
                                            <option value="BLUE">BLUE</option>
                                        </select>
                                    {:else if key === 'teleopClimb'}
                                        <select
                                            value={editedPayload[key] || 'No Climb'}
                                            onchange={(e) => {
                                                editedPayload[key] = e.target.value;
                                                createQr();
                                            }}
                                            class="editable-select"
                                        >
                                            <option value="none">{$_("teleop.climb.no_climb")}</option>
                                            <option value="L1">L1</option>
                                            <option value="L2">L2</option>
                                            <option value="L3">L3</option>
                                        </select>
                                    {:else if key === 'arenaPosNumber'}
                                        <select
                                            value={editedPayload[key] || '1'}
                                            onchange={(e) => {
                                                editedPayload[key] = e.target.value;
                                                createQr();
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
                                        bind:value={editedPayload[key]}
                                        oninput={() => createQr()}
                                        class="editable-input"
                                    />
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="button-container">
            <form method="dialog">
            <button onclick={() => {showEditModal = false}} class="btn btn-ghost btn-sm">
                {$_('misc.cancel_button')}
            </button>
            </form>
            <button onclick={saveEdit} class="btn btn-primary btn-sm hover:bg-primary-base bg-buttons border-buttons">
                {$_('misc.save_button')}
            </button>
        </div>
    </div>

    </div>
    <form method="dialog" class="modal-backdrop">
        <button>{$_('misc.close_button')}</button>
    </form>
</dialog>

<Toast showToast={showRepeatedDataToast} message={"Repeated Data! Data wil be deleted"}/>

<style lang="postcss">
    .edit-modal-container {
        @apply flex flex-col;
        width: 75vw;
        max-width: 90vw;
        max-height: 85vh;
        box-sizing: border-box;
        overflow: hidden;
    }

    .edit-modal-title {
        @apply text-xl font-bold mb-2 text-center;
        flex-shrink: 0;
    }

    .table-container {
        @apply w-full dark:text-[#EAEAEC];
        box-sizing: border-box;
        margin-bottom: 0.5rem;
        max-height: calc(85vh - 120px);
        overflow-y: auto;
        overflow-x: hidden;
    }

    .edit-table {
        @apply w-full text-sm;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .edit-table th,
    .edit-table td {
        padding: 0.25rem 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.875rem;
    }

    .edit-table th {
        @apply bg-opacity-10 bg-primary-opac text-left;
        width: 40%;
    }

    .edit-table td {
        @apply bg-transparent;
        width: 60%;
    }

    .editable-input {
        @apply bg-transparent border border-primary-base rounded px-1.5 py-0.5 text-[#EAEAEC] dark:text-white;
        width: 100%;
        font-size: 0.875rem;
        box-sizing: border-box;
    }

    .editable-input:focus {
        @apply outline-none border-primary-light ring-1 ring-primary-light;
    }

    .editable-checkbox {
        @apply w-4 h-4 cursor-pointer;
        accent-color: var(--color-primary-base);
    }

    .editable-select {
        @apply bg-transparent border border-primary-base rounded px-1.5 py-0.5 text-[#EAEAEC] dark:text-white cursor-pointer;
        width: 100%;
        font-size: 0.875rem;
        box-sizing: border-box;
    }

    .editable-select:focus {
        @apply outline-none border-primary-light ring-1 ring-primary-light;
    }

    .editable-select option {
        @apply bg-grey-heavy text-white;
    }

    .button-container {
        @apply flex flex-row gap-2 justify-end w-full;
        flex-shrink: 0;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
    }

    .button-container button {
        flex-shrink: 0;
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
    }
</style>
