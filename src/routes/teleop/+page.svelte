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
                "feedingFuelNumber": feedingFuelNumber
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
		<h1 class=" page-title header">{$_('teleop.title')}</h1>
		
	</div>

	<div class="hub-div container items-center justify-center rounded">
		<div class="w-full flex items-center justify-center bg-primary-base p-1 relative rounded-t">
			<h2 class="text-white text-normal font-medium">Hub Scores</h2>
			
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">

		    <button class="grow w-10 h-10 rounded-100 bg-gray-500 hover:bg-gray-700 flex items-center justify-center text-white font-bold shadow" onclick={() => {scoredFuelNumber-=1}}> -</button>
    		<div class="grow center w-16 h-10 bg-blue-700  flex items-center justify-center text-2xl font-extrabold">{scoredFuelNumber}</div>
    		<button class="grow flex px-3 py-2  bg-gray-500 hover:bg-gray-700 items-center text-center font-semibold" onclick={() => {scoredFuelNumber+=1}}>   +</button>
    		
		</div>

        <div class="w-full flex items-center rounded-b overflow-hidden">
           	<button onclick={()=>{scoredFuelNumber-=10}} class="minus10 grow flex items-center justify-center align-middle p-3 text-normal">-10</button>
           	<button onclick={()=>{scoredFuelNumber-=5}} class="minus5 grow flex items-center justify-center align-middle p-3 text-normal ">-5</button>
           	<button onclick={()=>{scoredFuelNumber+=5}} class="plus5 grow flex items-center justify-center align-middle p-3 text-normal ">+5</button>
           	<button onclick={()=>{scoredFuelNumber+=10}} class="plus10 grow flex items-center justify-center align-middle p-3 text-normal">+10</button>
        </div>
	</div>
	

    <div class="flex-direction:column mb-5 items-center justify-center  w-200"> 
		<div class=" flex items-center justify-center pt-1 relative rounded-t">
			<h2 class="text-white mb-2 text-normal font-size:10em text-2xl">Collected In</h2>
			
		</div>
		<div class="pt-3 gap-7 flex items-center justify-between">
	
       		
       			<button class="w-20 h-10 container py-1 rounded-md font-semibold  " onclick={() => {!collectsFromDepot}}>Depot</button>
       			<button class="w-20 h-10 container py-1 rounded-md font-semibold" onclick={() => {!collectsFromGround}}>Ground</button>
       			<button class="w-20 h-10 container py-1 rounded-md font-semibold" onclick={() => {!collectsFromOutpost}}>Outpost</button>
       		
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
		@apply shadow rounded-md mb-3 flex flex-col justify-around ;
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
</style>
