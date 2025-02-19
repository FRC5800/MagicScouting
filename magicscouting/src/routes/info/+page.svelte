<script>
// @ts-nocheck

    import "../../app.css";
    
    import { _ } from 'svelte-i18n';
	import { App } from '@capacitor/app';
    import { goto, beforeNavigate } from '$app/navigation';
    
    import storeData from "$lib/shared/scripts/controlData.js";
    import InfoSelect from "./infoSelect.svelte";
    import ResetModal from '$lib/components/ResetModal.svelte';

    let teamRole = "";
    let robotStatus = "";
    let coopertition = "";
    let validationError = false;

    async function onSubmit() {
		if(teamRole == '' || robotStatus == '' || coopertition == '') {
			validationError = true;
		}else {
			validationError = false;
			storeData({
            "robotFunction": teamRole,
            "robotStatus": robotStatus,
            "coopBonus": coopertition,
            });
            goto("/qrcode")
		}
	}

    let resetConfirmation = false;
	App.addListener("backButton", ()=>{resetConfirmation = true;});
    beforeNavigate(({ to, cancel }) => {
		if (to?.route.id !== "/qrcode") {
			if (!confirm("Do you really want to reset the app?")) {
      	cancel();
    	}
    }
  });

</script>

<ResetModal bind:resetConfirmation={resetConfirmation}/>

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">{$_('info.team_role')}</h2>
    </div>
    <div class="w-full border-b-2 invisible"></div>
    <div class="w-full flex items-center justify-between">
        <div on:click={()=>{teamRole="atk"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="atk" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.attack')}</div>
        <div on:click={()=>{teamRole="def"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="def" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.defense')}</div>
        <div on:click={()=>{teamRole="sup"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="sup" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.support')}</div>
    </div>
</div>
<span class="validation-error-message {((validationError) && (teamRole == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">{$_('info.robot_status')}</h2>
    </div>
    <div class="w-full border-b-2 invisible"></div>
    <div class="w-full flex items-center justify-between">
        <div on:click={()=>{robotStatus="safe"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="safe" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.safe')}</div>
        <div on:click={()=>{robotStatus="broke"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="broke" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.broke')}</div>
        <div on:click={()=>{robotStatus="commLoss"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="commLoss" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.communication_fault')}</div>
    </div>
</div>
<span class="validation-error-message {((validationError) && (robotStatus == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">{$_('info.coopertition')}</h2>
    </div>
    <div class="w-full border-b-2 invisible"></div>
    <div class="w-full flex items-center justify-between">
        <div on:click={()=>{coopertition="yes"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {coopertition=="yes" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.yes')}</div>
        <div on:click={()=>{coopertition="no"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {coopertition=="no" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.no')}</div>
    </div>
</div>
<span class="validation-error-message {((validationError) && (coopertition == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>

<button on:click={onSubmit} class="w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons">{$_('info.continue_button')}</button>

<style lang="postcss">
    h2{
        @apply font-black;
    }
    .container {
		@apply shadow rounded-md mb-3 flex flex-col justify-around w-[80vw];
		box-shadow: 0 1px 6px 0 rgba(15,98,254,.3);
	}
    
</style>
