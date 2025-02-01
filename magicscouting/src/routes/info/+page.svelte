<script>
// @ts-nocheck

    import "../../app.css";
    
    import { _ } from 'svelte-i18n';
	import { App } from '@capacitor/app';
    import { goto } from '$app/navigation';
    
    import storeData from "$lib/shared/scripts/controlData.js";
    import InfoSelect from "./infoSelect.svelte";
    import ResetModal from '$lib/components/ResetModal.svelte';

    let teamRole = "";
    let robotStatus = "";
    let coopertition = "";

    function onSubmit(){
        storeData({
            "robotFunction": teamRole,
            "robotStatus": robotStatus,
            "coopBonus": coopertition,
        });
        goto("/qrcode")
    }

    let resetConfirmation = false;
	App.addListener("backButton", ()=>{resetConfirmation = true;});

</script>

<ResetModal bind:resetConfirmation={resetConfirmation}/>

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">Team Role</h2>
    </div>
    <div class="w-full flex items-center justify-between">
        <div on:click={()=>{teamRole="atk"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="atk" ? 'bg-primary-base':''}">Pontuador</div>
        <div on:click={()=>{teamRole="def"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="def" ? 'bg-primary-base':''}">Defensor</div>
        <div on:click={()=>{teamRole="sup"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="sup" ? 'bg-primary-base':''}">Suporte</div>
    </div>
</div>

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">Robot Status</h2>
    </div>
    <div class="w-full flex items-center justify-between">
        <div on:click={()=>{robotStatus="safe"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="safe" ? 'bg-primary-base':''}">Safe</div>
        <div on:click={()=>{robotStatus="broke"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="broke" ? 'bg-primary-base':''}">Broke</div>
        <div on:click={()=>{robotStatus="commLoss"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="commLoss" ? 'bg-primary-base':''}">Comm Loss</div>
    </div>
</div>

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">Coopertition Bonus</h2>
    </div>
    <div class="w-full flex items-center justify-between">
        <div on:click={()=>{coopertition="yes"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {coopertition=="yes" ? 'bg-primary-base':''}">Yes</div>
        <div on:click={()=>{coopertition="no"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {coopertition=="no" ? 'bg-primary-base':''}">No</div>
    </div>
</div>

<button on:click={onSubmit} class="mt-10 btn btn-block">{$_('info.continue_button')}</button>

<style lang="postcss">
    h2{
        @apply font-black;
    }
    .container {
		@apply shadow rounded-md mb-3 flex flex-col justify-around w-[80vw];
		box-shadow: 0 1px 6px 0 rgba(15,98,254,.3);
	}
</style>
