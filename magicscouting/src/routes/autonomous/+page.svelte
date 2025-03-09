<script>
// @ts-nocheck

	import '../.././app.css';

	import { _ } from 'svelte-i18n';
	import { App } from '@capacitor/app';
	import { goto, beforeNavigate } from '$app/navigation';
	
	import storeData from "$lib/shared/scripts/controlData.js";
  import ResetModal from '$lib/components/ResetModal.svelte';

	//CORAL VALUES
	let lvl1CoralPoints = 0;
	let lvl2CoralPoints = 0;
	let lvl3CoralPoints = 0;
	let lvl4CoralPoints = 0;
	let coralSelectedLevel = "lvl1"
	let lvl1CoralMisses = 0;
	let lvl2CoralMisses = 0;
	let lvl3CoralMisses = 0;
	let lvl4CoralMisses = 0;
	
	//ALGAE VALUES
	let lowAlgae = 0;
	let highAlgae = 0;
	let algaeSelectedLevel = "low"

	// PROCESSOR
	let processorPoints = 0;
	let processorMisses = 0;

	let netPoints = 0;
	let netMisses = 0;
	
	//LEAVE VALUE
	$: leave = false;
	
	let resetConfirmation = false;
	App.addListener("backButton", ()=>{resetConfirmation = true;});
	beforeNavigate(({ to, cancel }) => {
		if (to?.route.id !== "/teleop") {
			if (!confirm("Do you really want to reset the app?")) {
      			cancel();
    		}
    	}
  	});
	
	function setCoralPoint(point){
		if (coralSelectedLevel == "lvl1" && !(point<0 && lvl1CoralPoints == 0)) {lvl1CoralPoints+=point}
		else if (coralSelectedLevel == "lvl2" && !(point<0 && lvl2CoralPoints == 0)) {lvl2CoralPoints+=point}
		else if (coralSelectedLevel == "lvl3" && !(point<0 && lvl3CoralPoints == 0)) {lvl3CoralPoints+=point}
		else if (coralSelectedLevel == "lvl4" && !(point<0 && lvl4CoralPoints == 0)) {lvl4CoralPoints+=point}
	}
	function setCoralMiss(miss){
		if (coralSelectedLevel == "lvl1" && !(miss<0 && lvl1CoralMisses == 0)) {lvl1CoralMisses+=miss}
		else if (coralSelectedLevel == "lvl2" && !(miss<0 && lvl2CoralMisses == 0)) {lvl2CoralMisses+=miss}
		else if (coralSelectedLevel == "lvl3" && !(miss<0 && lvl3CoralMisses == 0)) {lvl3CoralMisses+=miss}
		else if (coralSelectedLevel == "lvl4" && !(miss<0 && lvl4CoralMisses == 0)) {lvl4CoralMisses+=miss}
	}
	function setAlgaePoint(point){
		if (algaeSelectedLevel == "low" && !(point<0 && lowAlgae == 0)) {lowAlgae+=point}
		else if (algaeSelectedLevel == "high" && !(point<0 && highAlgae == 0)) {highAlgae+=point}
	}
	
	function onSubmit() {
		storeData({
			"autoROneScore": lvl1CoralPoints, 
			"autoRTwoScore": lvl2CoralPoints, 
			"autoRThreeScore": lvl3CoralPoints, 
			"autoRFourScore": lvl4CoralPoints,
			"autoROneMiss": lvl1CoralMisses,
			"autoRTwoMiss": lvl2CoralMisses,
			"autoRThreeMiss": lvl3CoralMisses,
			"autoRFourMiss": lvl4CoralMisses,
			"autoRemoveAlgaeLow": lowAlgae, 
			"autoRemoveAlgaeHigh": highAlgae, 
			"autoProcessorScore": processorPoints, 
			"autoProcessorMiss": processorMisses, 
			"autoNetScore": netPoints, 
			"autoNetMiss": netMisses, 
			"isLeave": leave ? 1 : 0
		});
		goto('/teleop');
	}
</script>
<ResetModal bind:resetConfirmation={resetConfirmation}/>

<section class="w-full gap-3 text-neutral-600 dark:text-white mt-[3vh] flex flex-col items-center">
	<div class="flex flex-col">
		<h1 class="text-4xl header">{$_('autonomous.title')}</h1>
		<div class="separator w-full"></div>
	</div>
	
	<div class="container items-center justify-center rounded overflow-hidden ">
		<div class="w-full flex items-center justify-center bg-primary-base p-1">
			<h2 class="text-white text-normal font-medium">Reef - Coral</h2>
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
			<div on:click={()=>{setCoralPoint(-1)}} class="text-2xl text-[#474747] py-1 px-4 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{coralSelectedLevel=="lvl1" ? lvl1CoralPoints : coralSelectedLevel=="lvl2" ? lvl2CoralPoints : coralSelectedLevel=="lvl3" ? lvl3CoralPoints : coralSelectedLevel=="lvl4" ? lvl4CoralPoints : ''}</div>
			<div on:click={()=>{setCoralPoint(1)}} class="text-2xl text-[#474747] py-1 px-4 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F8D7DA]">
			<div on:click={()=>{setCoralMiss(-1)}} class="text-2xl text-[#474747] py-1 pl-4 pr-8">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{coralSelectedLevel=="lvl1" ? lvl1CoralMisses : coralSelectedLevel=="lvl2" ? lvl2CoralMisses : coralSelectedLevel=="lvl3" ? lvl3CoralMisses : coralSelectedLevel=="lvl4" ? lvl4CoralMisses : ''}</div>
			<div on:click={()=>{setCoralMiss(1)}} class="text-2xl text-[#474747] py-1 px-4 pr-8">+</div>
		</div>
		<div class="w-full flex items-center">
			<div on:click={()=>{coralSelectedLevel="lvl1"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl1" ? 'bg-primary-base':''}">LVL1</div>
			<div on:click={()=>{coralSelectedLevel="lvl2"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl2" ? 'bg-primary-base':''}">LVL2</div>
			<div on:click={()=>{coralSelectedLevel="lvl3"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl3" ? 'bg-primary-base':''}">LVL3</div>
			<div on:click={()=>{coralSelectedLevel="lvl4"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl4" ? 'bg-primary-base':''}">LVL4</div>
		</div>
	</div>

	<div class="container items-center justify-center rounded overflow-hidden ">
		<div class="w-full flex items-center justify-center bg-primary-base p-1">
			<h2 class="text-white text-normal font-medium">Reef - Algae</h2>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F4F4F4]">
			<div on:click={()=>{setAlgaePoint(-1)}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{algaeSelectedLevel=="low" ? lowAlgae : algaeSelectedLevel=="high" ? highAlgae : ''}</div>
			<div on:click={()=>{setAlgaePoint(1)}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-around">
			<div on:click={()=>{algaeSelectedLevel="low"}} class="grow flex items-center justify-center align-middle p-3 text-normal {algaeSelectedLevel=="low" ? 'bg-primary-base':''}">LOW</div>
			<div on:click={()=>{algaeSelectedLevel="high"}} class="grow flex items-center justify-center align-middle p-3 text-normal {algaeSelectedLevel=="high" ? 'bg-primary-base':''}">HIGH</div>
		</div>
	</div>

	<div class="container items-center justify-center rounded overflow-hidden ">
		<div class="w-full flex items-center justify-center bg-primary-base p-1">
			<h2 class="text-white text-normal font-medium">Processor</h2>
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
			<div on:click={()=>{if(processorPoints!=0)processorPoints-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{processorPoints}</div>
			<div on:click={()=>{processorPoints+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F8D7DA]">
			<div on:click={()=>{if(processorPoints!=0)processorMisses-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{processorMisses}</div>
			<div on:click={()=>{processorMisses+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
	</div>

	<div class="container items-center justify-center rounded overflow-hidden ">
		<div class="w-full flex items-center justify-center bg-primary-base p-1">
			<h2 class="text-white text-normal font-medium">Net</h2>
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
			<div on:click={()=>{if(netPoints!=0)netPoints-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{netPoints}</div>
			<div on:click={()=>{netPoints+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F8D7DA]">
			<div on:click={()=>{if(netMisses!=0)netMisses-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{netMisses}</div>
			<div on:click={()=>{netMisses+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
	</div>
	
	<button
		on:click={() => {leave = !leave;}}
		id="leave"
		class="btn btn-block p-2 rounded-xl box-border border-2 dark:border-0 {leave
			? ' text-white bg-primary-base border-primary-base'
			: 'text-neutral-600 bg-transparent dark:bg-slate-100 border-gray-700'}">{$_('autonomous.leave_button')}</button
	>

	<button class="w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons" on:click={onSubmit}> {$_('autonomous.continue_button')} </button>
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
