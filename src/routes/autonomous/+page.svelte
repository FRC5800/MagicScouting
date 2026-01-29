<script>
// @ts-nocheck

	import '../.././app.css';

	import { _ } from 'svelte-i18n';
	import { App } from '@capacitor/app';
	import { goto, beforeNavigate } from '$app/navigation';

	import storeData from "$lib/shared/scripts/controlData.js";
  	import ResetModal from '$lib/components/ResetModal.svelte';
	import ReefImage from "$lib/assets/reef_image.png";

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


	function startClimbTime() {
		climbTimeCounting = true;
		climbTime = 0;
		climbTimer = setInterval(() => {
		if(pauseClimbTime != 'paused') climbTime = Math.round((climbTime+0.1)*10)/10;
		}, 100);
	}

	function stopClimbTime() {
		climbTimeCounting = false;
		pauseClimbTime = '';
		clearInterval(climbTimer);
		console.log(climbTime);
	}
	function discardClimbTime() {
		climbTimeCounting = false;
		pauseClimbTime = '';
		clearInterval(climbTimer);
		climbTime = 0;
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
			"collectsFromGround": collectsFromGround,
			"collectsFromOutpost": collectsFromOutpost,
			"collectsFromNeutral": collectsFromNeutral,
			"collectsFromDepot": collectsFromDepot,
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
		<h1 class="text-4xl header">{$_('autonomous.title')}</h1>
		<div class="separator w-full"></div>
	</div>

	<div class="container items-center justify-center rounded">
		<div class="w-full flex items-center justify-center bg-primary-base p-1 relative rounded-t">
			<h2 class="text-white text-normal font-medium">HUB</h2>
			<img src={ReefImage} alt="" class="absolute right-0 -top-3 w-14">
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
		    <button class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow" onclick={() => {scoredFuelNumber-=1}}> -1</button>

		<!-- main hub score block -->
		<!-- <div class="bg-blue-600 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg"> -->
    		<div class="w-16 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-2xl font-extrabold">{scoredFuelNumber}</div>
    		<div class="grid grid-cols-3 gap-1">
    			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {scoredFuelNumber+=1}}>+1</button>
    			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {scoredFuelNumber+=5}}>+5</button>
    			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {scoredFuelNumber+=10}}>+10</button>
    		</div>
		</div>

		<div class="w-full flex items-center rounded-b overflow-hidden">
			<button onclick={()=>{collectsFromGround=!collectsFromGround}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromGround ? 'bg-primary-base':''}">GROUND</button>
			<button onclick={()=>{collectsFromDepot=!collectsFromDepot}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromDepot ? 'bg-primary-base':''}">DEPOT</button>
			<button onclick={()=>{collectsFromNeutral=!collectsFromNeutral}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromNeutral ? 'bg-primary-base':''}">NEUTRAL</button>
			<button onclick={()=>{collectsFromOutpost=!collectsFromOutpost}} class="grow flex items-center justify-center align-middle p-3 text-normal {collectsFromOutpost ? 'bg-primary-base':''}">OUTPOST</button>
		</div>
	</div>
	<button
		onclick={() => {climb = !climb;}}
		id="climb"
		class="btn btn-block p-2 rounded-xl box-border border-2 dark:border-0 {climb
			? ' text-white bg-primary-base border-primary-base'
			: 'text-neutral-600 bg-transparent dark:bg-slate-100 border-gray-700'}">Auto Climb
	</button>

	<div class="input input-bordered overflow-hidden p-0 w-full flex flex-row items-center justify-between">
		<div class="w-1/2 text-center">
			<p class="p-3"><b> {climbTime.toFixed(1)} </b></p>
		</div>
    	{#if !climbTimeCounting}
    		<div role="button" tabindex="0" onkeydown={(e) => {if (e.key == "Enter") startClimbTime()}} onclick={startClimbTime} class="startCycle">
    		<p class="">{climbTime==0 ? $_('teleop.barge_cycle.start_cycle') : "Restart"}</p>
    		</div>
    	{:else}
    		<div class="flex flex-row items-center justify-around w-1/2 h-full p-3 border-l cursor-pointer">

    			<i
    			role="button" tabindex="0"
    			onkeydown={(e) => {if(e.key == "Enter") pauseClimbTime = pauseClimbTime == 'paused' ? '' : 'paused'}}
    			onclick={() => {pauseClimbTime = pauseClimbTime == 'paused' ? '' : 'paused'}}
    			class="w-3/12 text-center flex text-[1.7rem] {pauseClimbTime == 'paused' ? 'fi fi-sr-play text-[1.6rem]' : 'fi fi-sr-pause text-[1.7rem]'}">
    			</i>

    			<i role="button" tabindex="0" onkeydown={(e) => {if (e.key == "Enter") stopClimbTime()}} onclick={stopClimbTime} class="w-3/12 flex text-center text-[1.8rem] fi fi-sr-check"></i>

    			<i role="button" tabindex="0" onkeydown={(e) => {if (e.key == "Enter") discardClimbTime()}} onclick={discardClimbTime} class="fi fi-br-cross flex w-3/12 text-center text-[1.6rem]"></i>

    		</div>
    	{/if}
	</div>

	<button class="w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons" onclick={onSubmit}> {$_('autonomous.continue_button')} </button>
</section>

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
</style>
