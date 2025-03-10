<script>
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

	let showModal = false;
	let cancelCycle = false;

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
	//BARGE VALUES
	let barge = "none"

	let resetConfirmation = false;
	let redirectUrl = ""

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

	App.addListener("backButton", () => {resetConfirmation = true;});
	beforeNavigate(({ to, cancel }) => {
		if (to?.route.id !== "/info") {
			if (!confirm("Do you really want to reset the app?")) {
      			cancel();
    		}
    	}
  	});

	//barge timer
	let bargeCycle = 0;
	let bargeTimer;
	let bargeCycleCounting = false;
	let pauseBargeCycle = '';

	//GamePiece timer
	let gamePieceCycle = 0;
	let coralFloorCycle = [];
	let coralStationCycle = [];
	let algaeCycle = [];
	let gamePieceTimer;
	let gamePieceCycleCounting = false;
	let pauseGamePieceCycle = '';
	let gpType = "";
	let sourceType = "";
	$: selectedTimerOption = gpType=="algae" ? 2 : gpType=="coral" && sourceType=="station" ? 1 : gpType=="coral" && sourceType=="floor" ? 0 : -1;
	$: console.log(selectedTimerOption)
	let TimerOptions = [
		{ id: '0', content: "Coral Chão", value: 'coralFloor', handler: () => {handleGamePieceCycle(coralFloorCycle)} },
		{ id: '1', content: "Coral Station", value: 'coralStation', handler: () => {handleGamePieceCycle(coralStationCycle)}},
		{ id: '2', content: "Algae", value: 'algae', handler: () => {handleGamePieceCycle(algaeCycle)}}
	];

	function startBargeCycle() {
		bargeCycleCounting = true;
		bargeCycle = 0;
		bargeTimer = setInterval(() => {
			if(pauseBargeCycle != 'paused') bargeCycle = Math.round((bargeCycle+0.1)*10)/10;
		}, 100);
	}

	function stopBargeCycle() {
		bargeCycleCounting = false;
		pauseBargeCycle = '';
		clearInterval(bargeTimer);
		console.log(bargeCycle);
	}
	function discardBargeCycle() {
		bargeCycleCounting = false;
		pauseBargeCycle = '';
		clearInterval(bargeTimer);
		bargeCycle = 0;
	}

	function startGamePieceCycle() {
		gamePieceCycleCounting = true;
		gamePieceCycle = 0;
		gamePieceTimer = setInterval(() => {
			if(pauseGamePieceCycle != 'paused') gamePieceCycle = Math.round((gamePieceCycle+0.1)*10)/10;
		}, 100);
	}

	function stopGamePieceCycle() {
		gamePieceCycleCounting = false;
		pauseGamePieceCycle = '';
		clearInterval(gamePieceTimer);
		console.log(gamePieceCycle);
		showModal = false;
		cancelCycle = false;
	}
	function discardGamePieceCycle() {
		gamePieceCycleCounting = false;
		pauseGamePieceCycle = '';
		clearInterval(gamePieceTimer);
		gamePieceCycle = 0;
		showModal = false;
		cancelCycle = false;
	}

	function handleGamePieceCycle(location){
		console.log("this is floorcycle: " + coralFloorCycle)
		console.log("this is location: " + location);
		location.push(Math.round(gamePieceCycle*10)/10);	
		gamePieceCycle = 0;
	}

	function onSubmit() {
		storeData({
			 	"teleopROneScore": lvl1CoralPoints,
				"teleopRTwoScore": lvl2CoralPoints,
				"teleopRThreeScore": lvl3CoralPoints,
				"teleopRFourScore": lvl4CoralMisses,
				"teleopROneMiss": lvl1CoralMisses,
				"teleopRTwoMiss": lvl2CoralMisses,
				"teleopRThreeMiss": lvl3CoralMisses,
				"teleopRFourMiss": lvl4CoralMisses,
				"teleopRemoveAlgaeHigh": highAlgae,
				"teleopRemoveAlgaeLow": lowAlgae,
				"teleopProcessorScore": processorPoints,
				"teleopProcessorMiss": processorMisses,
				"teleopNetScore": netPoints,
				"teleopNetMiss": netMisses,
				"bargeStatus": barge,
				"bargeTime": String(bargeCycle).replace(".", ","),
				"coralStationCycleTime": JSON.stringify(coralStationCycle).replaceAll("[", "").replaceAll("]", "").replaceAll(",", ";").replaceAll(".", ","),
				"coralFloorCycleTime": JSON.stringify(coralFloorCycle).replaceAll("[", "").replaceAll("]", "").replaceAll(",", ";").replaceAll(".", ","),
				"algaeCycleTime":JSON.stringify(algaeCycle).replaceAll("[", "").replaceAll("]", "").replaceAll(",", ";").replaceAll(".", ","),
				});
		goto('/info');
	}
</script>
<ResetModal bind:resetConfirmation={resetConfirmation}/>

<section class="w-4/5 gap-3 text-neutral-600 dark:text-white mt-[3vh] flex flex-col items-center mb-20">
	<div class="flex flex-col w-full">
		<h1 class="text-4xl header">{$_('teleop.title')}</h1>
		<div class="separator w-full"></div>
	</div>
	

	<div class="container items-center justify-center rounded">
		<div class="w-full flex items-center justify-center bg-primary-base p-1 relative rounded-t">
			<h2 class="text-white text-normal font-medium">Reef - Coral</h2>
			<img src={ReefImage} alt="" class="absolute right-0 -top-3 w-14">
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
			<div on:click={()=>{setCoralPoint(-1)}} class="text-2xl text-[#474747] py-1 px-4 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{coralSelectedLevel=="lvl1" ? lvl1CoralPoints : coralSelectedLevel=="lvl2" ? lvl2CoralPoints : coralSelectedLevel=="lvl3" ? lvl3CoralPoints : coralSelectedLevel=="lvl4" ? lvl4CoralPoints : ''}</div>
			<div on:click={()=>{setCoralPoint(1)}} class="text-2xl text-[#474747] py-1 px-4 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F8D7DA]">
			<div on:click={()=>{setCoralMiss(-1)}} class="text-2xl text-[#474747] py-1 px-4 pl-8">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{coralSelectedLevel=="lvl1" ? lvl1CoralMisses : coralSelectedLevel=="lvl2" ? lvl2CoralMisses : coralSelectedLevel=="lvl3" ? lvl3CoralMisses : coralSelectedLevel=="lvl4" ? lvl4CoralMisses : ''}</div>
			<div on:click={()=>{setCoralMiss(1)}} class="text-2xl text-[#474747] py-1 px-4 pr-8">+</div>
		</div>
		<div class="w-full flex items-center rounded-b overflow-hidden">
			<div on:click={()=>{coralSelectedLevel="lvl1"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl1" ? 'bg-primary-base':''}">LVL1</div>
			<div on:click={()=>{coralSelectedLevel="lvl2"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl2" ? 'bg-primary-base':''}">LVL2</div>
			<div on:click={()=>{coralSelectedLevel="lvl3"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl3" ? 'bg-primary-base':''}">LVL3</div>
			<div on:click={()=>{coralSelectedLevel="lvl4"}} class="grow flex items-center justify-center align-middle p-3 text-normal {coralSelectedLevel=="lvl4" ? 'bg-primary-base':''}">LVL4</div>
		</div>
	</div>

	<div class="container items-center justify-center">
		<div class="w-full flex items-center justify-center bg-primary-base p-1 rounded-t relative">
			<h2 class="text-white text-normal font-medium">Reef - Algae</h2>
			<img src={ReefImage} alt="" class="absolute right-0 -top-3 w-14">
		</div>
		<div class="w-full flex items-center justify-between bg-[#F4F4F4]">
			<div on:click={()=>{setAlgaePoint(-1)}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{algaeSelectedLevel=="low" ? lowAlgae : algaeSelectedLevel=="high" ? highAlgae : ''}</div>
			<div on:click={()=>{setAlgaePoint(1)}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-around rounded-b overflow-hidden">
			<div on:click={()=>{algaeSelectedLevel="low"}} class="grow flex items-center justify-center align-middle p-3 text-normal {algaeSelectedLevel=="low" ? 'bg-primary-base':''}">LOW</div>
			<div on:click={()=>{algaeSelectedLevel="high"}} class="grow flex items-center justify-center align-middle p-3 text-normal {algaeSelectedLevel=="high" ? 'bg-primary-base':''}">HIGH</div>
		</div>
	</div>

	<div class="container items-center justify-center">
		<div class="w-full flex items-center justify-center bg-primary-base p-1 rounded-t relative">
			<h2 class="text-white text-normal font-medium">Processor</h2>
			<img src={ProcessorImage} alt="" class="absolute right-0 -top-3 w-14">
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
			<div on:click={()=>{if(processorPoints!=0)processorPoints-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{processorPoints}</div>
			<div on:click={()=>{processorPoints+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F8D7DA] rounded-b overflow-hidden ">
			<div on:click={()=>{if(processorMisses!=0)processorMisses-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{processorMisses}</div>
			<div on:click={()=>{processorMisses+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
	</div>

	<div class="container items-center justify-center">
		<div class="w-full flex items-center justify-center bg-primary-base p-1 rounded-t relative">
			<h2 class="text-white text-normal font-medium">Net</h2>
			<img src={NetImage} alt="" class="absolute right-0 -top-3 w-14">
		</div>
		<div class="w-full flex items-center justify-between bg-[#D4EDDA]">
			<div on:click={()=>{if(netPoints!=0)netPoints-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{netPoints}</div>
			<div on:click={()=>{netPoints+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F8D7DA] rounded-b overflow-hidden ">
			<div on:click={()=>{if(netMisses!=0)netMisses-=1}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{netMisses}</div>
			<div on:click={()=>{netMisses+=1}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
	</div>

	<div class="flex flex-col">
		<h3 class="text-4xl header">{$_('teleop.endgame_title')}</h3>
		<div class="separator w-full"></div>
	</div>
	<div class="w-full flex flex-col items-center relative">
		<h4 class="text-normal" >{$_('teleop.barge_points')}</h4>
		<div class="input input-bordered p-0 flex justify-between w-full overflow-hidden" >
			<div on:click={()=>{barge = "none"}} class="p-3 grow basis-1 items-center flex justify-center {barge=="none" ? 'bg-primary-base text-[#E0E0E0]':''}">{$_('misc.none')}</div>
			<div on:click={()=>{barge = "park"}} class="p-3 grow basis-1 items-center flex justify-center {barge=="park" ? 'bg-primary-base text-[#E0E0E0]':''}">Park</div>
			<div on:click={()=>{barge = "shallow"}} class="p-3 grow basis-1 items-center flex justify-center {barge=="shallow" ? 'bg-primary-base text-[#E0E0E0]':''}">Shallow</div>
			<div on:click={()=>{barge = "deep"}} class="p-3 grow basis-1 items-center flex justify-center {barge=="deep" ? 'bg-primary-base text-[#E0E0E0]':''}">Deep</div>
		</div>
		
	</div>

	<div class="w-full flex flex-col items-center justify-center CycleBarge">
		<h4 class="time-barge-title">{$_('teleop.barge_cycle.title')}</h4>

		<div class="input input-bordered overflow-hidden p-0 w-full flex flex-row items-center justify-between">
			<div class="w-1/2 text-center">
				<p class="p-3"><b> {bargeCycle.toFixed(1)} </b></p>
			</div>
			{#if !bargeCycleCounting}
				<div role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") startBargeCycle()}} on:click={startBargeCycle} class="startCycle">
					<p class="">{bargeCycle==0 ? $_('teleop.barge_cycle.start_cycle') : "Restart"}</p>
				</div>
			{:else}
				<div class="flex flex-row items-center justify-around w-1/2 h-full p-3 border-l cursor-pointer">
					
					<i 
					role="button" tabindex="0"
					on:keydown={(e) => {if(e.key == "Enter") pauseBargeCycle = pauseBargeCycle == 'paused' ? '' : 'paused'}}
					on:click={() => {pauseBargeCycle = pauseBargeCycle == 'paused' ? '' : 'paused'}}
					class="w-3/12 text-center flex text-[1.7rem] {pauseBargeCycle == 'paused' ? 'fi fi-sr-play text-[1.6rem]' : 'fi fi-sr-pause text-[1.7rem]'}">
					</i>
					
					<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") stopBargeCycle()}} on:click={stopBargeCycle} class="w-3/12 flex text-center text-[1.8rem] fi fi-sr-check"></i>
					
					<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") discardBargeCycle()}} on:click={discardBargeCycle} class="fi fi-br-cross flex w-3/12 text-center text-[1.6rem]"></i>
				
				</div>
			{/if}
		</div>
	</div>
	<button on:click={onSubmit} class="w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons">{$_('teleop.continue_button')}</button>
</section>

<div class="fixed right-8 bottom-24 p-1 backdrop-blur-md rounded-full">
	<div on:click={()=>{showModal=true; startGamePieceCycle();console.log(showModal)}} class="bg-primary-base w-8 h-8 p-2 rounded-full flex items-center justify-center box-content">
		<i class="fi fi-sr-pending flex dark:text-[#121212] text-[#E0E0E0]"></i>
	</div>
</div>

<Modal bind:showModal showX={false} changeNameLater={false}>
	<h2 class="text-2xl">{$_('teleop.note_cycle.title')}</h2>
	<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
    <div class="w-full flex items-center justify-center bg-primary-base p-1">
        <h2 class="text-white text-normal font-medium">Game Piece</h2>
    </div>
    <div class="w-full flex items-center justify-between">
        <div on:click={()=>{gpType="coral"}} class="grow flex items-center justify-center align-middle p-3 text-normal {gpType=="coral" ? 'bg-primary-base':''}">Coral</div>
        <div on:click={()=>{gpType="algae"}} class="grow flex items-center justify-center align-middle p-3 text-normal {gpType=="algae" ? 'bg-primary-base':''}">Algae</div>
    </div>
	</div>

	{#if gpType=="coral"}
		<div class="mt-4 container items-center justify-center rounded overflow-hidden ">
			<div class="w-full flex items-center justify-center bg-primary-base p-1">
					<h2 class="text-white text-normal font-medium">{$_('teleop.note_cycle.source')}</h2>
			</div>
			<div class="w-full flex items-center justify-between">
					<div on:click={()=>{sourceType="station"}} class="grow flex items-center justify-center align-middle p-3 text-normal {sourceType=="station" ? 'bg-primary-base':''}">Station</div>
					<div on:click={()=>{sourceType="floor"}} class="grow flex items-center justify-center align-middle p-3 text-normal {sourceType=="floor" ? 'bg-primary-base':''}">{$_('teleop.note_cycle.option_floor')}</div>
			</div>
		</div>		
	{/if}


	<div class="container items-center justify-center rounded overflow-hidden ">
		<div class="w-full flex items-center justify-center bg-primary-base p-1">
			<h2 class="text-white text-normal font-medium">{$_('teleop.note_cycle.timer')}</h2>
		</div>
		<div class="w-full flex items-center justify-between bg-[#F4F4F4] py-1">
			<div on:click={()=>{setCoralPoint(-1)}} class="text-2xl text-[#474747] px-4 py-1 pl-8 select-none">-</div>
			<div class="text-[#474747]  p-1 px-8 rounded-md">{gamePieceCycle}</div>
			<div on:click={()=>{setCoralPoint(1)}} class="text-2xl text-[#474747] px-4 py-1 pr-8 select-none">+</div>
		</div>
		<div class="w-full flex items-center">
			<div on:click={()=>{cancelCycle=true}} class="grow flex items-center justify-center align-middle p-3 text-normal bg-[#F8D7DA] text-black">{$_('misc.cancel_button')}</div>
			<div on:click={()=>{if(pauseGamePieceCycle!="paused"){pauseGamePieceCycle="paused"}else{pauseGamePieceCycle=""}}} class="grow flex items-center justify-center align-middle p-3 text-normal bg-[#D6EAF8] text-black">{pauseGamePieceCycle!="paused" ? $_('teleop.note_cycle.pause') : $_('teleop.note_cycle.start_cycle')}</div>
			{#if selectedTimerOption!=-1}				
			<div on:click={()=>{stopGamePieceCycle(); TimerOptions[selectedTimerOption].handler()}} class="grow flex items-center justify-center align-middle p-3 text-normal bg-[#D4EDDA] text-black">{$_('misc.save_button')}</div>
			{/if}
		</div>
	</div>
	{#if cancelCycle}
		<div on:click={()=>{discardGamePieceCycle();console.log(showModal)}} class="text-red-500 underline">{$_('teleop.note_cycle.cancel_confirmation')}</div>
	{/if}
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