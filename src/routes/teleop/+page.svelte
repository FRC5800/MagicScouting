<script>
// @ts-nocheck

	import { run } from 'svelte/legacy';

	import '../.././app.css';
	import { _ } from 'svelte-i18n'
	import { App } from '@capacitor/app';
	import { goto, beforeNavigate } from '$app/navigation';
	import storeData from "$lib/shared/scripts/controlData.js";
    import ResetModal from '$lib/components/ResetModal.svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import ReefImage from "$lib/assets/reef_image.png";
	import ProcessorImage from "$lib/assets/processor_image.png";
	import NetImage from "$lib/assets/net_image.png";
	import BargeImage from "$lib/assets/barge_image.png";

	let scoredFuelNumber = $state(0);
	let collectsFromGround = $state(false);
	let collectsFromOutpost = $state(false);
	let collectsFromNeutral = $state(false);
	let collectsFromDepot = $state(false);
	let hubScoreMode = $state(true); // true for Hub Score, false for Feeding

	// Ensure numbers never go negative
	$effect(() => {
		if (scoredFuelNumber < 0) scoredFuelNumber = 0;
		if (feedingFuelNumber < 0) feedingFuelNumber = 0;
	});

	let climb = $state(false);
	let climbTime = $state(0);
	let climbLevel = $state("none");

	let climbTimeCounting = $state(false);
	let pauseClimbTime = $state(false);
	let climbTimer;
	let showClimbTimer = $state(false);

	function startClimbTime() {
		// Check if timer was already run
		if (climb || climbTime > 0) {
			if (!confirm("The climb timer has already been run. Do you want to restart it? This will reset the previous time.")) {
				return; // User cancelled, don't start the timer
			}
		}

		climbTimeCounting = true;
		climbTime = 0;
		climb = false; // Reset climb status when restarting
		climbLevel = "none"; // Reset climb level when restarting
		showClimbTimer = true;
		climbTimer = setInterval(() => {
		if(pauseClimbTime != 'paused') climbTime = Math.round((climbTime+0.1)*10)/10;
		}, 100);
	}

	function stopClimbTime() {
		climbTimeCounting = false;
		pauseClimbTime = '';
		clearInterval(climbTimer);
		showClimbTimer = false;
		climb = true; // Mark that climb was completed
		// Auto-select L1 when timer finishes
		if (climbTime > 0) {
			climbLevel = "L1";
		}
		console.log(climbTime);
	}
	function discardClimbTime() {
		climbTimeCounting = false;
		pauseClimbTime = '';
		clearInterval(climbTimer);
		climbTime = 0;
		showClimbTimer = false;
		climb = false;
		climbLevel = "none";
	}

	let feedingFuelNumber = $state(0);

	let depotClicked = $state(false);
	let groundClicked = $state(false);
	let outpostClicked = $state(false);

	let resetConfirmation = $state(false);

	// Initialize climb level based on timer state
	$effect(() => {
		if (!climb && climbTime === 0) {
			climbLevel = "none";
		}
	});

	App.addListener("backButton", () => {resetConfirmation = true;});
	beforeNavigate(({ to, cancel }) => {
		if (to?.route.id !== "/info") {
			if (!confirm("Do you really want to reset the app?")) {
      			cancel();
    		}
    	}
  	});

	function onSubmit() {
		storeData({
			 	"teleopFuelNumber": scoredFuelNumber,
               	"teleopCollectsFromGround": collectsFromGround ? 1 : 0,
               	"teleopCollectsFromOutpost": collectsFromOutpost ? 1 : 0,
               	"teleopCollectsFromNeutral": collectsFromNeutral ? 1 : 0,
               	"teleopCollectsFromDepot": collectsFromDepot ? 1 : 0,
                "teleopClimb": climbLevel,
                "teleopClimbTime": climbTime,
                "feedingFuelNumber": feedingFuelNumber,
		});
		goto('/info');
	}

	$effect( () => {
	    console.log($state.snapshot({
				"teleopFuelNumber": scoredFuelNumber,
               	"teleopCollectsFromGround": collectsFromGround,
               	"teleopCollectsFromOutpost": collectsFromOutpost,
               	"teleopCollectsFromNeutral": collectsFromNeutral,
               	"teleopCollectsFromDepot": collectsFromDepot,
                "teleopClimb": climbLevel,
                "teleopClimbTime": climbTime,
                "feedingFuelNumber": feedingFuelNumber
			}))
	})
</script>
<ResetModal bind:resetConfirmation={resetConfirmation}/>
<section class="w-full gap-3 text-neutral-600 dark:text-white mt-[3vh] flex flex-col items-center">

	<div class="flex flex-col">
		<h1 class="text-2xl header">{$_('teleop.title')}</h1>
		<div class="separator w-full"></div>
	</div>

	<div class="container items-center justify-center rounded">
		<div class="w-full flex items-center justify-center p-0 relative rounded-t-xl overflow-hidden">
			<button
				onclick={() => {hubScoreMode = true}}
				class="flex-1 flex items-center justify-center p-2 text-white text-normal font-medium box-border border-2 border-primary-base rounded-tl-xl {hubScoreMode ? 'bg-primary-base':''}"
			>
				Hub Score
			</button>
			<button
				onclick={() => {hubScoreMode = false}}
				class="flex-1 flex items-center justify-center p-2 text-white text-normal font-medium box-border border-2 border-primary-base rounded-tr-xl {!hubScoreMode ? 'bg-primary-base':''}"
			>
				Feeding
			</button>
		</div>
		<div class="w-full flex flex-row items-center justify-between ">
			<button aria-label="minus_score" class="w-1/4 bg-white bg-opacity-30 flex flex-col justify-center h-[60px] box-border items-center" onclick={() => {if (hubScoreMode) { scoredFuelNumber = Math.max(0, scoredFuelNumber - 1); } else { feedingFuelNumber = Math.max(0, feedingFuelNumber - 1); }}}>
				<svg class="fill-white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="25" height="25">
				<g>
					<path d="M480,288H32c-17.673,0-32-14.327-32-32s14.327-32,32-32h448c17.673,0,32,14.327,32,32S497.673,288,480,288z"/>
				</g>
				</svg>
			</button>
			<div class="grow flex flex-col justify-center h-[60px] box-border items-center">
				<div class="bg-white px-6 text-black rounded-full text-2xl font-bold">
					{hubScoreMode ? scoredFuelNumber : feedingFuelNumber}
				</div>
			</div>
			<button aria-label="plus_score" class="w-1/4 bg-white bg-opacity-30 flex flex-col justify-center h-[60px] box-border items-center" onclick={() => {hubScoreMode ? scoredFuelNumber+=1 : feedingFuelNumber+=1}}>
				<svg class="fill-white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="25" height="25">
				<g>
					<path d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z"/>
				</g>
				</svg>
			</button>
		    <!-- <button class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow" onclick={() => {scoredFuelNumber-=1}}> -1</button>

    		<div class="w-16 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-2xl font-extrabold">{scoredFuelNumber}</div>
    		<div class="grid grid-cols-3 gap-1">
    			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {scoredFuelNumber+=1}}>+1</button>
    			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {scoredFuelNumber+=5}}>+5</button>
    			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {scoredFuelNumber+=10}}>+10</button>
    		</div> -->
		</div>

		<div class="w-full flex items-center rounded-b-xl overflow-hidden">
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#FF383C]" onclick={() => {if (hubScoreMode) { scoredFuelNumber = Math.max(0, scoredFuelNumber - 10); } else { feedingFuelNumber = Math.max(0, feedingFuelNumber - 10); }}}>-10</button>
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#FF686B]" onclick={() => {if (hubScoreMode) { scoredFuelNumber = Math.max(0, scoredFuelNumber - 5); } else { feedingFuelNumber = Math.max(0, feedingFuelNumber - 5); }}}>-5</button>
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#80E89E]" onclick={() => {hubScoreMode ? scoredFuelNumber+=5 : feedingFuelNumber+=5}} >+5</button>
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#34C759]" onclick={() => {hubScoreMode ? scoredFuelNumber+=10 : feedingFuelNumber+=10}}>+10</button>
		</div>
		<!-- <div class="w-full flex items-center rounded-b overflow-hidden">
			<button onclick={()=>{collectsFromGround=!collectsFromGround}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromGround ? 'bg-primary-base':''}">GROUND</button>
			<button onclick={()=>{collectsFromDepot=!collectsFromDepot}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromDepot ? 'bg-primary-base':''}">DEPOT</button>
			<button onclick={()=>{collectsFromNeutral=!collectsFromNeutral}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromNeutral ? 'bg-primary-base':''}">NEUTRAL</button>
			<button onclick={()=>{collectsFromOutpost=!collectsFromOutpost}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromOutpost ? 'bg-primary-base':''}">OUTPOST</button>
		</div> -->
	</div>

    <div class="flex flex-col justify-around w-[80vw]">
		<h1 class="text-lg header mb-2">Collected in:</h1>
		<div class="flex flex-row gap-2">
			<button onclick={()=>{collectsFromDepot=!collectsFromDepot}} class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {collectsFromDepot ? 'bg-primary-base':''}">Depot</button>
			<button onclick={()=>{collectsFromGround=!collectsFromGround}} class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {collectsFromGround ? 'bg-primary-base':''}">Ground</button>
			<button onclick={()=>{collectsFromOutpost=!collectsFromOutpost}} class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {collectsFromOutpost ? 'bg-primary-base':''}">Outpost</button>
			<button onclick={()=>{collectsFromNeutral=!collectsFromNeutral}} class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {collectsFromNeutral ? 'bg-primary-base':''}">Neutral</button>
		</div>
	</div>

	<div class="flex flex-row gap-2 w-[80vw] items-center">
		<button
			onclick={startClimbTime}
			class="btn mt-4 btn-primary bg-[#FFCC00] border-none hover:bg-[#CCA400] bg-buttons border-buttons font-bold flex-1"
		>
			Go Climb!
		</button>
		<div class="climb-timer-display-box">
			{climbTime.toFixed(1)}s
		</div>
	</div>
	<div class="flex flex-row gap-2 w-[80vw] mt-2">
		<button
			onclick={()=>{climbLevel="none"}}
			class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {climbLevel == "none" ? 'bg-primary-base':''}"
			disabled={climb}
		>
			No climb
		</button>
		<button
			onclick={()=>{climbLevel="L1"}}
			class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {climbLevel == "L1" ? 'bg-primary-base':''}"
			disabled={!climb}
		>
			L1
		</button>
		<button
			onclick={()=>{climbLevel="L2"}}
			class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {climbLevel == "L2" ? 'bg-primary-base':''}"
			disabled={!climb}
		>
			L2
		</button>
		<button
			onclick={()=>{climbLevel="L3"}}
			class="grow flex items-center justify-center align-middle h-[60px] border-primary-base border-2 rounded-md text-normal {climbLevel == "L3" ? 'bg-primary-base':''}"
			disabled={!climb}
		>
			L3
		</button>
	</div>

	<div class="separator w-[80%]"></div>
	<button onclick={onSubmit} class="w-[80%] btn mb-32 mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons">{$_('info.continue_button')}</button>

</section>

<Modal bind:showModal={showClimbTimer} showX={false} changeNameLater={false}>
	<div class="climb-timer-container">
		<h2 class="climb-timer-title">Climb Timer</h2>
		<div class="climb-timer-display">
			<span class="climb-timer-value">
				{climbTime.toFixed(1)}
			</span>
			<span class="climb-timer-unit">seconds</span>
		</div>
		<button
			onclick={stopClimbTime}
			class="climb-timer-stop-btn"
		>
			Stop Timer
		</button>
	</div>
</Modal>


<style lang="postcss">
	h3 {
		margin-bottom: 2px;
		margin-top: 3px;
		font-weight: 600;
		font-size: 20px;
		justify-content: center;
		text-align: center;
	}

	h4 {
		margin-bottom: 2px;
		margin-top: 3px;
		font-weight: 800;
		font-size: 15px;
	}
	p {
		text-align: center;
	}
	i {
		margin-left: 4px;
		margin-right: 4px;
		padding-left: 3px;
		padding-right: 3px;
	}
	.label-endgame {
		text-align: center;
	}

	.label {
		font-size: 13px;
	}

	.container {
		@apply shadow rounded-md mb-3 flex flex-col justify-around w-[80vw];
		box-shadow: 0 1px 6px 0 rgba(15,98,254,.3);
	}
	.containerBox {
		@apply border-x-2 border-t-[3px] rounded-xl border-neutral-800 dark:bg-grey-heavy dark:border-neutral-600;
	}
	.plusMinusBlock {
		@apply flex flex-col justify-between items-center w-3/6 min-h-[120px] bg-transparent border-[1px] border-neutral-600 dark:border-0 dark:bg-[#2e2947] pt-2 rounded-b-xl overflow-auto;
	}
	.points {
		@apply bg-primary-light transition-all duration-[0.15s] ease-in-out active:scale-90;
		width: 50%;
		margin: 0;
		font-size: 30px;
		text-align: center;
	}
	.count{
		@apply w-[50%] bg-primary-base rounded-2xl text-white;
	}
	.cycle {
		@apply w-1/2 min-h-[150px];
	}
	.startCycle{
		@apply  w-1/2 h-full p-2 cursor-pointer hover:bg-primary-base hover:text-[#E0E0E0] flex justify-center items-center;
	}

	.separator {
		@apply bg-gradient-to-r from-gradient-light to-gradient-heavy;
		height: 2px;
		margin-top: 6px;
		margin-bottom: 10px;
		align-self: center;
		width: 60%;
	}

	button, div{
		@apply select-none;
	}
	.page-title{
		margin-top: 0;
		margin-bottom: 1em;
		font-size: 3em;
	}
	.hub-div{
		margin-top: 0;
		margin-bottom: 2em;
		width: 30em;
		border-radius: 1em;
		align-items:flex-start ;
		align-self: center;

	}
	.minus10{
		color: black;
		background-color: rgb(255, 56, 60);
	}
	.minus5{
		color: white;
		background-color: #ff686a;
	}
	.plus5{
		color: white;
		background-color: #80e99e;
	}
	.plus10{
		color: white;
		background-color: #34c758;

	}

	/* Animated CTA Button */
	.cta {
		display: flex;
		padding: 11px 33px;
		text-decoration: none;
		font-size: 25px;
		color: white;
		background: var(--color-primary-light);
		transition: 1s;
		box-shadow: 6px 6px 0 var(--color-primary-heavy);
		transform: skewX(-15deg);
		border: none;
		cursor: pointer;
		font-weight: bold;
	}

	.cta:focus {
		outline: none;
	}

	.cta:hover {
		transition: 0.5s;
		box-shadow: 10px 10px 0 var(--color-primary-light);
	}

	.cta .second {
		transition: 0.5s;
		margin-right: 0px;
	}

	.cta:hover .second {
		transition: 0.5s;
		margin-right: 45px;
	}

	.span {
		transform: skewX(15deg);
	}

	.second {
		width: 20px;
		margin-left: 30px;
		position: relative;
		top: 12%;
	}

	.one {
		transition: 0.4s;
		transform: translateX(-60%);
	}

	.two {
		transition: 0.5s;
		transform: translateX(-30%);
	}

	.cta:hover .three {
		animation: color_anim 1s infinite 0.2s;
	}

	.cta:hover .one {
		transform: translateX(0%);
		animation: color_anim 1s infinite 0.6s;
	}

	.cta:hover .two {
		transform: translateX(0%);
		animation: color_anim 1s infinite 0.4s;
	}

	@keyframes color_anim {
		0% {
			fill: white;
		}

		50% {
			fill: var(--color-primary-light);
		}

		100% {
			fill: white;
		}
	}

	.climb-timer-container {
		@apply flex flex-col items-center justify-center py-8 px-6;
		min-width: 300px;
	}

	.climb-timer-title {
		@apply text-2xl font-bold mb-6 text-center;
		color: inherit;
	}

	.climb-timer-display {
		@apply flex flex-col items-center justify-center mb-8;
	}

	.climb-timer-value {
		@apply text-7xl font-bold mb-2;
		background: linear-gradient(135deg, var(--color-gradient-light) 0%, var(--color-gradient-heavy) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: pulse 2s ease-in-out infinite, numberUpdate 0.1s ease-out;
		display: inline-block;
		font-variant-numeric: tabular-nums;
		transition: transform 0.1s ease-out;
	}

	.climb-timer-unit {
		@apply text-xl text-neutral-500 dark:text-neutral-400;
	}

	.climb-timer-stop-btn {
		@apply px-8 py-4 text-lg font-semibold rounded-lg shadow-lg text-white;
		background: var(--color-primary-light);
		transition: all 0.3s ease;
		transform: scale(1);
	}

	.climb-timer-stop-btn:hover {
		background: var(--color-primary-light);
		transform: scale(1.05);
		box-shadow: 0 10px 25px var(--color-primary-light-opac);
	}

	.climb-timer-stop-btn:active {
		transform: scale(0.98);
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes numberUpdate {
		0% {
			transform: scale(1) translateY(0);
			opacity: 0.8;
		}
		50% {
			transform: scale(1.02) translateY(-2px);
			opacity: 1;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}

	.climb-timer-display-box {
		@apply flex items-center justify-center;
		min-width: 80px;
		height: 50px;
		color: white;
		border-radius: 8px;
		font-weight: bold;
		font-size: 18px;
		margin-top: 16px;
		border: solid 3px var(--color-primary-light);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}
</style>
