<script>
// @ts-nocheck

	import '../.././app.css';

	import { _ } from 'svelte-i18n';
	import { App } from '@capacitor/app';
	import { goto, beforeNavigate } from '$app/navigation';

	import storeData from "$lib/shared/scripts/controlData.js";
  	import ResetModal from '$lib/components/ResetModal.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ReefImage from "$lib/assets/reef_image.png";
	import Plus from "$lib/assets/minus.svg";
	import Minus from "$lib/assets/plus.svg";

	//CORAL VALUES
	let scoredFuelNumber = $state(0);
	let collectsFromGround = $state(false);
	let collectsFromOutpost = $state(false);
	let collectsFromNeutral = $state(false);
	let collectsFromDepot = $state(false);

	let climb = $state(false);
	let climbTime = $state(0);

	let climbTimeCounting = $state(false);
	let pauseClimbTime = $state(false);
	let climbTimer;
	let showClimbTimer = $state(false);


	function startClimbTime() {
		climbTimeCounting = true;
		climbTime = 0;
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
		console.log(climbTime);
	}
	function discardClimbTime() {
		climbTimeCounting = false;
		pauseClimbTime = '';
		clearInterval(climbTimer);
		climbTime = 0;
		showClimbTimer = false;
	}



	let resetConfirmation = $state(false);
	App.addListener("backButton", ()=>{resetConfirmation = true;});
	beforeNavigate(({ to, cancel }) => {
		if (to?.route.id !== "/teleop") {
			if (!confirm("Do you really want to reset the app?")) {
      			cancel();
    		}
    	}
  	});

	function onSubmit() {
		storeData({
			"autoFuelNumber": scoredFuelNumber,
			"autoCollectsFromGround": collectsFromGround,
			"autoCollectsFromOutpost": collectsFromOutpost,
			"autoCollectsFromNeutral": collectsFromNeutral,
			"autoCollectsFromDepot": collectsFromDepot,
			"autoClimb": climb,
			"autoClimbTime": climbTime,
		});
		goto('/teleop');
	}

	$effect(() => {
	  console.log($state.snapshot({
				"autoFuelNumber": scoredFuelNumber,
				"collectsFromGround": collectsFromGround,
				"collectsFromOutpost": collectsFromOutpost,
				"collectsFromNeutral": collectsFromNeutral,
				"collectsFromDepot": collectsFromDepot,
				"autoClimb": climb,
				"autoClimbTime": climbTime,
			}));
	});

</script>
<ResetModal bind:resetConfirmation={resetConfirmation}/>

<section class="w-full gap-3 text-neutral-600 dark:text-white mt-[3vh] flex flex-col items-center">
	<div class="flex flex-col">
		<h1 class="text-2xl header">{$_('autonomous.title')}</h1>
		<div class="separator w-full"></div>
	</div>

	<div class="container items-center justify-center rounded">
		<div class="w-full flex items-center justify-center bg-primary-base p-2 relative rounded-t-xl">
			<h2 class="text-white text-normal font-medium">Hub Scores</h2>
		</div>
		<div class="w-full flex flex-row items-center justify-between ">
			<button aria-label="minus_score" class="w-1/4 bg-white bg-opacity-30 flex flex-col justify-center h-[60px] box-border items-center" onclick={() => {scoredFuelNumber-=1}}>
				<svg class="fill-white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="25" height="25">
				<g>
					<path d="M480,288H32c-17.673,0-32-14.327-32-32s14.327-32,32-32h448c17.673,0,32,14.327,32,32S497.673,288,480,288z"/>
				</g>
				</svg>
			</button>
			<div class="grow flex flex-col justify-center h-[60px] box-border items-center">
				<div class="bg-white px-6 text-black rounded-full">
					{scoredFuelNumber}
				</div>
			</div>
			<button aria-label="plus_score" class="w-1/4 bg-white bg-opacity-30 flex flex-col justify-center h-[60px] box-border items-center" onclick={() => {scoredFuelNumber+=1}}>
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
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#FF383C]" onclick={() => {scoredFuelNumber-=10}}>-10</button>
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#FF686B]" onclick={() => {scoredFuelNumber-=1}}>-5</button>
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#80E89E]" onclick={() => {scoredFuelNumber+=5}} >+5</button>
			<button class="grow flex-1 flex h-[60px] items-center justify-center align-middle text-normal bg-[#34C759]" onclick={() => {scoredFuelNumber+=10}}>+10</button>
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

	<button
		onclick={startClimbTime}
		class="w-[80vw] btn mt-4 btn-primary bg-[#FFCC00] border-none hover:bg-[#CCA400] bg-buttons border-buttons font-bold"
	>
		Go Climb!
	</button>

	<div class="separator w-[80%]"></div>
	<button onclick={onSubmit} class="w-[80%] btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons">{$_('info.continue_button')}</button>
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
	.header {
		font-weight: 900;
		font-weight: 900;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
	}

	h4 {
		@apply dark:text-white;
		margin-bottom: 2px;
	}
	p {
		@apply dark:text-white;
		margin-top: 2px;
	}
	.points {
		@apply flex items-center justify-center w-full h-9 border-[1px] border-black dark:border-neutral-600 rounded-md bg-transparent dark:bg-neutral-200 text-neutral-600 hover:text-neutral-800 active:bg-buttons;
		font-size: 40px;
		font-weight: 700;
		text-align: center;
	}

	.separator {
		@apply my-3 bg-gradient-to-r from-gradient-light to-gradient-heavy;
		height: 2px;
		align-self: center;
	}

	.speaker-img {
		width: 100%;
	}
	.amp-img {
		width: 75%;
	}
	.container {
		@apply shadow rounded-md mb-3 flex flex-col justify-around w-[80vw];
		box-shadow: 0 1px 6px 0 rgba(15,98,254,.3);
	}

	.image {
		@apply flex justify-center items-center;
	}

	.leave {
		width: 80vw;
		font-size: 20px;
		font-weight: 600;
		justify-content: center;
		text-align: center;
	}

	button, div{
		@apply select-none;
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
</style>
