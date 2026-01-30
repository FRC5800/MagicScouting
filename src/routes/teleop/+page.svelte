<script>
	import { run } from 'svelte/legacy';

	// @ts-nocheck

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

	let climbTime = $state(0);
	let climbLevel = $state("none")

	let climbTimeCounting = $state(false);
	let pauseClimbTime = $state(false);
	let climbTimer;

	let passesByBump = $state(false);
	let passesByLowBar = $state(false);

	let feedingFuelNumber = $state(0);

	function startClimbTime() {
		climbTimeCounting = true;
		climbTime = 0;
		pauseClimbTime = false;
		climbTimer = setInterval(() => {
		if(!pauseClimbTime) climbTime = Math.round((climbTime+0.1)*10)/10;
		}, 100);
	}

	function stopClimbTime() {
		climbTimeCounting = false;
		pauseClimbTime = true;
		clearInterval(climbTimer);
		console.log(climbTime);
	}
	function discardClimbTime() {
		climbTimeCounting = false;
		pauseClimbTime = true;
		clearInterval(climbTimer);
		climbTime = 0;
	}



	let resetConfirmation = $state(false);

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
               	"teleopCollectsFromGround": collectsFromGround,
               	"teleopCollectsFromOutpost": collectsFromOutpost,
               	"teleopCollectsFromNeutral": collectsFromNeutral,
               	"teleopCollectsFromDepot": collectsFromDepot,
                "teleopClimb": climbLevel,
                "teleopClimbTime": climbTime,
                "passesByBump": passesByBump,
                "passesByLowBar": passesByLowBar,
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
                "passesByBump": passesByBump,
                "passesByLowBar": passesByLowBar,
                "feedingFuelNumber": feedingFuelNumber
			}))
	})
</script>
<ResetModal bind:resetConfirmation={resetConfirmation}/>
<section class="w-full gap-3 text-neutral-600 dark:text-white mt-[3vh] flex flex-col items-center">
	<div class="flex flex-col">
		<h1 class="text-4xl header">{$_('teleop.title')}</h1>
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
	<div class="w-full flex items-center rounded-b overflow-hidden">
        <button onclick={()=>{climbLevel = "none"}} class="grow flex items-center justify-center align-middle p-3 text-normal {climbLevel == "none" ? 'bg-primary-base':''}">No Climb</button>
	    <button onclick={()=>{climbLevel = "L1"}} class="grow flex items-center justify-center align-middle p-3 text-normal {climbLevel == "L1" ? 'bg-primary-base':''}">L1</button>
		<button onclick={()=>{climbLevel = "L2"}} class="grow flex items-center justify-center align-middle p-3 text-normal {climbLevel == "L2" ? 'bg-primary-base':''}">L2</button>
		<button onclick={()=>{climbLevel = "L3"}} class="grow flex items-center justify-center align-middle p-3 text-normal {climbLevel == "L3" ? 'bg-primary-base':''}">L3</button>
	</div>

	<div class="w-full flex items-center rounded-b overflow-hidden">
       	<button onclick={()=>{passesByBump=!passesByBump}} class="grow flex items-center justify-center align-middle p-3 text-normal {passesByBump ? 'bg-primary-base':''}">BUMP</button>
       	<button onclick={()=>{passesByLowBar=!passesByLowBar}} class="grow flex items-center justify-center align-middle p-3 text-normal {passesByLowBar ? 'bg-primary-base':''}">LOW-BAR</button>
    </div>


    <div class="container items-center justify-center rounded">
		<div class="w-full flex items-center justify-center bg-primary-base p-1 relative rounded-t">
			<h2 class="text-white text-normal font-medium">Feed</h2>
			<img src={ReefImage} alt="" class="absolute right-0 -top-3 w-14">
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
		    <button class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow" onclick={() => {feedingFuelNumber-=1}}> -1</button>

		<!-- main hub score block -->
		<!-- <div class="bg-blue-600 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg"> -->
       		<div class="w-16 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-2xl font-extrabold">{feedingFuelNumber}</div>
       		<div class="grid grid-cols-3 gap-1">
       			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {feedingFuelNumber+=1}}>+1</button>
       			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {feedingFuelNumber+=5}}>+5</button>
       			<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => {feedingFuelNumber+=10}}>+10</button>
       		</div>
		</div>
    </div>

    <button onclick={onSubmit} class="w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons">{$_('teleop.continue_button')}</button>

</section>


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
		@apply shadow rounded-md mb-3 flex flex-col justify-around w-full;
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
		width: 60%;
		margin-left: 20%;
	}

	button, div{
		@apply select-none;
	}
</style>
