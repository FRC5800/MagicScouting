<script>
	// @ts-nocheck

	import '../.././app.css';
	import { _ } from 'svelte-i18n'
	import { App } from '@capacitor/app';
	import { goto } from '$app/navigation';
	import storeData from "$lib/shared/scripts/controlData.js";
    import ResetModal from '$lib/components/ResetModal.svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';

	let ampSpeakerStructure = [
		{title: $_('teleop.speaker'), score: 0, miss: 0},
		{title: $_('teleop.speaker_amplified'), score: 0, miss: null},
		{title: $_('teleop.amp'), score: 0, miss: 0},
	]

	let TimerOptions = [
		{ id: '1', content: $_('teleop.note_cycle.option_floor'), value: 'floor', handler: () => {handleNoteCycle(floorCycle)} },
		{ id: '2', content: $_('teleop.note_cycle.option_source'), value: 'source', handler: () => {handleNoteCycle(sourceCycle)}}
	];

	let selected_timer;
	let showMoreTimers = 'hidden';


	function handle_selection() {

	}
	let resetConfirmation = false;

	App.addListener("backButton", () => {resetConfirmation = true;});
	
	let highNoteOptions = [
		{ id: '1', content: $_('teleop.high_notes.option1'), value: '-1' },
		{ id: '2', content: $_('teleop.high_notes.option2'), value: '0' },
		{ id: '3', content: $_('teleop.high_notes.option3'), value: '1' },
		{ id: '4', content: $_('teleop.high_notes.option4'), value: '2' },
		{ id: '5', content: $_('teleop.high_notes.option5'), value: '3' }
	];
	let showMoreHighNotes = 'hidden';

	let chainOptions = [
		{ id: '1', content: $_('teleop.onstage.option1'), value: '-1' },
		{ id: '2', content: $_('teleop.onstage.option2'), value: '0' },
		{ id: '3', content: $_('teleop.onstage.option3'), value: '1' },
		{ id: '4', content: $_('teleop.onstage.option4'), value: '2' },
		{ id: '5', content: $_('teleop.onstage.option5'), value: '3' }
	];
	let showMoreChain = 'hidden';

	let trapOptions = [
		{ id: '1', content: $_('teleop.trap.option1'), value: '0' },
		{ id: '2', content: $_('teleop.trap.option2'), value: '-1' },
		{ id: '3', content: $_('teleop.trap.option3'), value: '1' }
	];
	let showMoreTrap = 'hidden';
	
	function onSubmit() {
		storeData({
			 	"teleopAmpScore": ampSpeakerStructure[2]["score"],
				 "teleopAmpMiss": ampSpeakerStructure[2]["miss"],
				"teleopSpeakerScore": ampSpeakerStructure[0]["score"],
				"teleopSpeakerMiss": ampSpeakerStructure[0]["miss"],
				"speakerAmplifiedScore":ampSpeakerStructure[1]["score"],
				"trapStatus":selected_trap.value,
				"onStageStatus": selected_chain.value,
				"onStageTime": onstageCycle,
				"sourceCycleTime": JSON.stringify(sourceCycle).replaceAll("[", "").replaceAll("]", "").replaceAll(",", ";").replaceAll(".", ","),
				"floorCycleTime":JSON.stringify(floorCycle).replaceAll("[", "").replaceAll("]", "").replaceAll(",", ";").replaceAll(".", ","),
				"highNoteStatus": selected_highNote.value,
				});
		goto('/info');
	}
	
	let selected_chain;
	let selected_highNote;
	let selected_trap;
	
	//note Cycle timer
	let noteTimer;
	let noteCycle = 0;
	let pauseNoteCycle = '';
	let noteCycleCounting = false;
	let askType = false;
	let floorCycle = [];
	let sourceCycle = [];

	//onstage timer
	let onstageCycle = 0;
	let onstageTimer;
	let onstageCycleCounting = false;
	let pauseOnstageCycle = '';

	function startNoteCycle() {
		noteCycleCounting = true;
		noteTimer = setInterval(() => {
			if(pauseNoteCycle != 'paused') noteCycle += 0.1;
		}, 100);
	}
	function stopNoteCycle() {
		noteCycleCounting = false;
		pauseNoteCycle = '';
		clearInterval(noteTimer);
		askType = true
		console.log(noteCycle);
		
		selected_timer.handler()
	}
	function discardNoteCycle() {
		noteCycleCounting = false;
		pauseNoteCycle = '';
		clearInterval(noteTimer);
		noteCycle = 0;
	}
	
	function startOnstageCycle() {
		onstageCycleCounting = true;
		onstageCycle = 0;
		onstageTimer = setInterval(() => {
			if(pauseOnstageCycle != 'paused') onstageCycle = Math.round((onstageCycle+0.1)*10)/10;
		}, 100);
	}
	function stopOnstageCycle() {
		onstageCycleCounting = false;
		pauseOnstageCycle = '';
		clearInterval(onstageTimer);
		console.log(onstageCycle);
	}
	function discardOnstageCycle() {
		onstageCycleCounting = false;
		pauseOnstageCycle = '';
		clearInterval(onstageTimer);
		onstageCycle = 0;
	}
	
	function handleNoteCycle(location){
		location.push(Math.round(noteCycle*10)/10);
		noteCycle = 0;
		console.log(location);
		askType = false;
	}

	
</script>
<ResetModal bind:resetConfirmation={resetConfirmation}/>

<main class="mt-[3vh] dark:text-white text-neutral-600">
	<h1 class="text-4xl font-[Lucida Sans]">{$_('teleop.title')}</h1>

	<div class="w-[30vw] separator mb-1"></div>

	<div class="container">
		{#each ampSpeakerStructure as item }
			<div class="w-1/2 p-1">
				<div class="flex flex-col items-center containerBox">
					<div class="title">
						<h5 class="font-semibold max-[355px]:text-xs">{item.title}</h5>
					</div>
					<div class="flex flex-row justify-around w-full">
						<div class="plusMinusBlock">
							<p class="label">{$_('teleop.scores')}</p>
							<p class="count">{item.score}</p>
							<div class="flex flex-row w-full">
								<button
								on:click={() => {
									item.score += 1;
								}}
								class="points">+</button
							>
							<button
								on:click={() => {
									if (item.score != 0) item.score -= 1;
								}}
								class="points">-</button
							>
							</div>

						</div>
						<div class="plusMinusBlock">
							<p class="label">{$_('teleop.misses')}</p>
							<p class="count">{item.miss ?? ampSpeakerStructure[0].miss}</p>
							<div class="flex flex-row w-full">
								<button
									on:click={() => {
										item.miss != null ? item.miss += 1 : ampSpeakerStructure[0].miss += 1;
									}}
									class="points">+</button>
								<button
									on:click={() => {
										if (item.miss != null) {
											if (item.miss != 0) item.miss -= 1
										}
										else {
											if (ampSpeakerStructure[0].miss != 0) {ampSpeakerStructure[0].miss -= 1}
										}
									}}
									class="points">-</button
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}

		<br />
		<div class="flex flex-col items-center justify-between w-1/2 cycle">
			<h4>{$_('teleop.note_cycle.title')}</h4>

			<div class=""><b>{noteCycle.toFixed(1)}</b></div>

			<div class="flex flex-col items-center justify-center w-full">
				{#if !noteCycleCounting && !askType}
					<div role="button" on:keydown={(e) => {if (e.key == "Enter") startNoteCycle()}} on:click={startNoteCycle} class="text-base border-[3px] border-[#494462] rounded-md startCycle">
						<p class="">{$_('teleop.note_cycle.start_cycle')}</p>
					</div>
				{:else if !noteCycleCounting && askType}
					<div class="flex items-center w-full">
						<button on:click={() => {handleNoteCycle(floorCycle)} } class="w-1/2 p-2 mx-2 rounded-lg dark:bg-grey-heavy" >{$_('teleop.note_cycle.option_floor')}</button>
						<button on:click={() => {handleNoteCycle(sourceCycle)} } class="w-1/2 p-2 mx-2 rounded-lg dark:bg-grey-heavy">{$_('teleop.note_cycle.option_source')}</button>
					</div>
				{:else} 
					<div class="flex flex-row items-center justify-between  h-full p-2 cursor-pointer border-[3px] border-[#494462] rounded-xl">
						<i 
						role="button" tabindex="0"
						on:keydown={(e) => {if(e.key == "Enter") pauseNoteCycle = pauseNoteCycle == 'paused' ? '' : 'paused'}}
						on:click={() => {pauseNoteCycle = pauseNoteCycle == 'paused' ? '' : 'paused'}}
						class="w-3/12 text-center {pauseNoteCycle == 'paused' ? 'fa-solid fa-play text-[1.6rem]' : 'fa-solid fa-pause text-[1.7rem]'}">
						</i>
						<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") stopNoteCycle()}} on:click={stopNoteCycle} class="w-3/12 text-green-600 text-center text-[1.8rem] fa-solid fa-check"></i>
						<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") discardNoteCycle()}} on:click={discardNoteCycle} class="fa-solid  text-red-600 fa-x w-3/12 text-center text-[1.6rem]"></i>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<h3>{$_('teleop.endgame_title')}</h3>
	<div class="separator"></div>
	<div class="flex flex-col items-center select-holder">
		<div class="w-3/4 highNote">
			<h4 class="label-endgame">{$_('teleop.high_notes.title')}</h4>
			<SelectInput
				options={highNoteOptions}
				bind:SelectedOption={selected_highNote}
				showMore={showMoreHighNotes}
				componentId={"highNote"}
			/>
		</div>

		<div class="w-3/4 trap">
			<h4 class="label-endgame">{$_('teleop.trap.title')}</h4>
			<SelectInput
				options={trapOptions}
				bind:SelectedOption={selected_trap}
				showMore={showMoreTrap}
				componentId={"chain"}
			/>
		</div>
		<div class="w-3/4 chain">
			<h4 class="label-endgame">{$_('teleop.onstage.title')}</h4>
			<SelectInput
				options={chainOptions}
				bind:SelectedOption={selected_chain}
				showMore={showMoreChain}
				componentId={"trap"}
			/>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center CycleOnstage">
		<h4 class="time-onstage-title">{$_('teleop.onstage_cycle.title')}</h4>


		<div class="flex flex-row items-center justify-between w-4/5 overflow-auto border-[3px] border-[#494462] rounded-xl">
			<div class="w-1/2 text-center border-r border-black">
				<p class="p-2"><b> {onstageCycle.toFixed(1)} </b></p>
			</div>
			{#if !onstageCycleCounting}
				<div role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") startOnstageCycle()}} on:click={startOnstageCycle} class="startCycle">
					<p class="">{$_('teleop.onstage_cycle.start_cycle')}</p>
				</div>
			{:else}
				<div class="flex flex-row items-center justify-around w-1/2 h-full p-2 border-l cursor-pointer">
					
					<i 
					role="button" tabindex="0"
					on:keydown={(e) => {if(e.key == "Enter") pauseOnstageCycle = pauseOnstageCycle == 'paused' ? '' : 'paused'}}
					on:click={() => {pauseOnstageCycle = pauseOnstageCycle == 'paused' ? '' : 'paused'}}
					class="w-3/12 text-center text-[1.7rem] {pauseOnstageCycle == 'paused' ? 'fa-solid fa-play text-[1.6rem]' : 'fa-solid fa-pause text-[1.7rem]'}">
					</i>
					
					<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") stopOnstageCycle()}} on:click={stopOnstageCycle} class="w-3/12 text-green-700 text-center text-[1.8rem] fa-solid fa-check"></i>
					
					<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") discardOnstageCycle()}} on:click={discardOnstageCycle} class="fa-solid text-red-600 fa-x w-3/12 text-center text-[1.6rem]"></i>
				
				</div>
			{/if}
		</div>

		<button on:click={onSubmit} class="w-2/3 p-2 mt-8 btn">{$_('teleop.continue_button')}</button>
	</div>

	<br />
	<br />
</main>

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
		@apply flex flex-row flex-wrap justify-center items-center;
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
		@apply  w-1/2 h-full p-2 cursor-pointer hover:bg-primary-base;
	}

	.separator {
		@apply bg-gradient-to-r from-gradient-light to-gradient-heavy;
		height: 2px;
		margin-top: 6px;
		margin-bottom: 10px;
		width: 60%;
		margin-left: 20%;
	}
</style>