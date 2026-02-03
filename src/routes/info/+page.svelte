<script>
// @ts-nocheck

    import "../../app.css";

    import { _ } from 'svelte-i18n';
	import { App } from '@capacitor/app';
    import { goto, beforeNavigate } from '$app/navigation';

    import storeData from "$lib/shared/scripts/controlData.js";
    import InfoSelect from "./infoSelect.svelte";
    import ResetModal from '$lib/components/ResetModal.svelte';

    let teamRole = $state("");
    let robotStatus = $state("safe");
    let humanPlayer = $state("");
    let passesByBump = $state(false);
    let passesByLowBar = $state(false);
    let validationError = $state(false);
    let animationTrigger = $state(0);

    async function onSubmit() {
		if(teamRole == '' || robotStatus == '' || humanPlayer == '') {
			validationError = true;
			// Increment trigger to retrigger animation
			animationTrigger++;
		}else {
			validationError = false;
			storeData({
            "robotFunction": teamRole,
            "robotStatus": robotStatus,
            "humanPlayer": humanPlayer,
            "passesByBump": passesByBump ? 1 : 0,
            "passesByLowBar": passesByLowBar ? 1 : 0,
            });
            goto("/qrcode")
		}
	}

    let resetConfirmation = $state(false);
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
        <div onclick={()=>{teamRole="score"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="score" ? 'bg-primary-base text-[#E0E0E0]':''}">Score</div>
        <div onclick={()=>{teamRole="feed"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="feed" ? 'bg-primary-base text-[#E0E0E0]':''}">Feed</div>
        <div onclick={()=>{teamRole="defense"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {teamRole=="defense" ? 'bg-primary-base text-[#E0E0E0]':''}">Defense</div>
    </div>
</div>
{#key animationTrigger}
    <span class="validation-error-message {((validationError) && (teamRole == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
{/key}

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">{$_('info.robot_status')}</h2>
    </div>
    <div class="w-full border-b-2 invisible"></div>
    <div class="w-full flex items-center justify-between">
        <div onclick={()=>{if(robotStatus=="broke"){robotStatus="safe"}else{robotStatus="broke"}}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="broke" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.broke')}</div>
        <div onclick={()=>{if(robotStatus=="commLoss"){robotStatus="safe"}else{robotStatus="commLoss"}}} class="text-normal flex justify-center items-center grow basis-1 p-3 {robotStatus=="commLoss" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.communication_fault')}</div>
    </div>
</div>
{#key animationTrigger}
    <span class="validation-error-message {((validationError) && (robotStatus == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
{/key}

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">{$_('Human Player ativo?')}</h2>
    </div>
    <div class="w-full border-b-2 invisible"></div>
    <div class="w-full flex items-center justify-between">
        <div onclick={()=>{humanPlayer="yes"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {humanPlayer=="yes" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.yes')}</div>
        <div onclick={()=>{humanPlayer="no"}} class="text-normal flex justify-center items-center grow basis-1 p-3 {humanPlayer=="no" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('info.no')}</div>
    </div>
</div>
{#key animationTrigger}
    <span class="validation-error-message {((validationError) && (humanPlayer == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
{/key}

<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">Passes</h2>
    </div>
    <div class="w-full border-b-2 invisible"></div>
    <div class="w-full flex items-center justify-between">
        <div onclick={()=>{passesByBump=!passesByBump}} class="text-normal flex justify-center items-center grow basis-1 p-3 {passesByBump ? 'bg-primary-base text-[#E0E0E0]':''}">Bump</div>
        <div onclick={()=>{passesByLowBar=!passesByLowBar}} class="text-normal flex justify-center items-center grow basis-1 p-3 {passesByLowBar ? 'bg-primary-base text-[#E0E0E0]':''}">Trench</div>
    </div>
</div>

<button onclick={onSubmit} class="w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons">{$_('info.continue_button')}</button>

<style lang="postcss">
    h2{
        @apply font-black;
    }
    .container {
		@apply shadow rounded-md mb-3 flex flex-col justify-around w-[80vw];
		box-shadow: 0 1px 6px 0 rgba(15,98,254,.3);
	}

    .validation-error-message{
        @apply text-red-600 font-bold;
        display: block;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .validation-error-message.visible {
        animation: shakeAndFade 0.5s ease-in-out;
    }

    @keyframes shakeAndFade {
        0% {
            opacity: 0;
            transform: translateX(-10px);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(10px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(-10px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
        }


</style>
