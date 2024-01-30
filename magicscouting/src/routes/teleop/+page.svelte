<script>
	// @ts-nocheck

	import '../.././app.css';
	import { goto } from '$app/navigation';
	import SelectInput from '$lib/components/SelectInput.svelte';
	import { _ } from 'svelte-i18n'
	import storeData from "$lib/shared/scripts/controlData.js";

	let ampSpeakerStructure = [
		{title: $_('teleop.speaker'), score: 0, miss: 0},
		{title: $_('teleop.speaker_amplified'), score: 0, miss: null},
		{title: $_('teleop.amp'), score: 0, miss: 0},
	]

	let TimerOptions = [
		{ id: '1', content: $_('teleop.note_cycle.option_floor'), value: 'floor', handler: handleFloor },
		{ id: '2', content: $_('teleop.note_cycle.option_source'), value: 'source', handler: handleSource}
	];
	let selected_timer;
	let showMoreTimers = 'hidden';

	function handle_selection() {

	}

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
			 	"teleopAmpScore": ampScoreTeleop,
				"teleopAmpMiss": ampMissTeleop,
				"teleopSpeakerScore": speakerScoreTeleop,
				"teleopSpeakerMiss": speakerMissTeleop,
				"speakerAmplifiedScore":speakerAmplifiedScore,
				"trapStatus":selected_trap.value,
				"onStageStatus": selected_chain.value,
				"onStageTime": onstageCicle,
				"sourceCycleTime": JSON.stringify(sourceCicle).replaceAll("[", "").replaceAll("]", "").replaceAll(",", ";").replaceAll(".", ","),
				"floorCycleTime":JSON.stringify(floorCicle).replaceAll("[", "").replaceAll("]", "").replaceAll(",", ";").replaceAll(".", ","),
				"highNoteStatus": selected_highNote.value,
				});
		goto('/info');
	}

	let selected_chain;
	let selected_highNote;
	let selected_trap;


	//VARIAVEIS DE SPEAKER
	$: speakerScoreTeleop = ampSpeakerStructure[0].score;
	$: speakerMissTeleop = ampSpeakerStructure[0].miss;
	$: speakerAmplifiedScore = ampSpeakerStructure[1].score;

	//VARIAVEIS DE AMP
	$: ampScoreTeleop = ampSpeakerStructure[2].score;
	$: ampMissTeleop = ampSpeakerStructure[2].miss;

	//note cicle timer
	let noteTimer;
	let noteCicle = 0;
	let pauseNoteCicle = '';
	let noteCicleCouting = false;
	let floorCicle = [];
	let sourceCicle = [];

	//onstage timer
	let onstageCicle = 0;
	let onstageTimer;
	let onstageCicleCouting = false;
	let pauseOnstageCicle = '';

	function startNoteCicle() {
		noteCicleCouting = true;
		noteTimer = setInterval(() => {
			if(pauseNoteCicle != 'paused') noteCicle += 0.1;
		}, 100);
	}
	function stopNoteCicle() {
		noteCicleCouting = false;
		pauseNoteCicle = '';
		clearInterval(noteTimer);
		console.log(noteCicle);

		selected_timer.handler()
	}
	function discartNoteCicle() {
		noteCicleCouting = false;
		pauseNoteCicle = '';
		clearInterval(noteTimer);
		noteCicle = 0;
	}

	function startOnstageCicle() {
		onstageCicleCouting = true;
		onstageTimer = setInterval(() => {
			if(pauseOnstageCicle != 'paused') onstageCicle += 0.1;
		}, 100);
	}
	function stopOnstageCicle() {
		onstageCicleCouting = false;
		pauseOnstageCicle = '';
		clearInterval(onstageTimer);
		console.log(onstageCicle);
		handleOnstage()
	}
	function discartOnstageCicle() {
		onstageCicleCouting = false;
		pauseOnstageCicle = '';
		clearInterval(onstageTimer);
		onstageCicle = 0;
	}

	function handleFloor() {
		floorCicle.push(Math.round(noteCicle*10)/10);
		noteCicle = 0;
		console.log(floorCicle);
	}
	function handleSource() {
		sourceCicle.push(Math.round(noteCicle*10)/10);
		noteCicle = 0;
		console.log(sourceCicle);
	}
	function handleOnstage() {
		onstageCicle = 0;
	}

</script>

<main class="mt-[3vh] dark:text-white text-neutral-600">
	<h1 class="text-4xl font-[Lucida Sans]">{$_('teleop.title')}</h1>

	<div class="w-[30vw] separator mb-1"></div>

	<div class="container">
		{#each ampSpeakerStructure as item }
			<div class="w-1/2 p-1">
				<div class="flex flex-col items-center containerBox">
					<div class="title">
						<h4>{item.title}</h4>
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
									class="points">+</button
								>
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
		<div class="flex flex-col items-center justify-between cicle">
			<h4>{$_('teleop.note_cycle.title')}</h4>
			<div class="flex flex-col items-center justify-center w-full">
				<div class="flex flex-row items-center border-[3px] border-[#494462] rounded-xl {!noteCicleCouting ? 'justify-between w-4/5' : 'justify-center w-1/3 border-b-0 rounded-b-none	'} overflow-auto">
					<div class="text-center {!noteCicleCouting ? 'border-r border-black w-1/2' : ''}">
						<p class="{!noteCicleCouting ? 'p-2' : ''}"><b> {noteCicle.toFixed(1)} </b></p>
					</div>
					{#if !noteCicleCouting}
						<div role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") startNoteCicle()}} on:click={startNoteCicle} class="startCicle">
							<p class="">{$_('teleop.note_cycle.start_cycle')}</p>
						</div>
					{/if}
				</div>
				{#if noteCicleCouting}
					<div class="flex flex-row items-center justify-between w-2/3 h-full p-2 cursor-pointer border-[3px] border-[#494462] rounded-xl">
						<i 
						role="button" tabindex="0"
						on:keydown={(e) => {if(e.key == "Enter") pauseNoteCicle = pauseNoteCicle == 'paused' ? '' : 'paused'}}
						on:click={() => {pauseNoteCicle = pauseNoteCicle == 'paused' ? '' : 'paused'}}
						class="w-3/12 text-center {pauseNoteCicle == 'paused' ? 'fa-solid fa-play text-[1.6rem]' : 'fa-solid fa-pause text-[1.7rem]'}">
						</i>
						
						<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") stopNoteCicle()}} on:click={stopNoteCicle} class="w-3/12 text-center text-[1.8rem] fa-solid fa-check"></i>
						
						<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") discartNoteCicle()}} on:click={discartNoteCicle} class="fa-solid fa-x w-3/12 text-center text-[1.6rem]"></i>
					</div>
				{/if}
			</div>

			<div class="w-1/2">
				<SelectInput options={TimerOptions} bind:opcaoSelecionada={selected_timer} showMore={showMoreTimers} componentId={'timers'} on:selection_updated={handle_selection} />
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
				bind:opcaoSelecionada={selected_highNote}
				showMore={showMoreHighNotes}
				componentId={"highNote"}
			/>
		</div>

		<div class="w-3/4 trap">
			<h4 class="label-endgame">{$_('teleop.trap.title')}</h4>
			<SelectInput
				options={trapOptions}
				bind:opcaoSelecionada={selected_trap}
				showMore={showMoreTrap}
				componentId={"chain"}
			/>
		</div>
		<div class="w-3/4 chain">
			<h4 class="label-endgame">{$_('teleop.onstage.title')}</h4>
			<SelectInput
				options={chainOptions}
				bind:opcaoSelecionada={selected_chain}
				showMore={showMoreChain}
				componentId={"trap"}
			/>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center cicleOnstage">
		<h4 class="time-onstage-title">{$_('teleop.onstage_cycle.title')}</h4>
		<div class="flex flex-row items-center justify-between w-4/5 overflow-auto border-[3px] border-[#494462] rounded-xl">
			<div class="w-1/2 text-center border-r border-black">
				<p class="p-2"><b> {onstageCicle.toFixed(1)} </b></p>
			</div>
			{#if !onstageCicleCouting}
				<div role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") startOnstageCicle()}} on:click={startOnstageCicle} class="startCicle">
					<p class="">{$_('teleop.onstage_cycle.start_cycle')}</p>
				</div>
			{:else}
				<div class="flex flex-row items-center justify-around w-1/2 h-full p-2 border-l cursor-pointer">
					
					<i 
					role="button" tabindex="0"
					on:keydown={(e) => {if(e.key == "Enter") pauseOnstageCicle = pauseOnstageCicle == 'paused' ? '' : 'paused'}}
					on:click={() => {pauseOnstageCicle = pauseOnstageCicle == 'paused' ? '' : 'paused'}}
					class="w-3/12 text-center text-[1.7rem] {pauseOnstageCicle == 'paused' ? 'fa-solid fa-play text-[1.6rem]' : 'fa-solid fa-pause text-[1.7rem]'}">
					</i>
					
					<i role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") stopOnstageCicle()}} on:click={stopOnstageCicle} class="w-3/12 text-center text-[1.8rem] fa-solid fa-check"></i>
					
					<i on:keydown={(e) => {if (e.key == "Enter") discartOnstageCicle()}} on:click={discartOnstageCicle} class="fa-solid fa-x w-3/12 text-center text-[1.6rem]"></i>
				
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
	.cicle {
		@apply w-1/2 min-h-[150px];
	}
	.startCicle{
		@apply  w-1/2 h-full p-2 border-l cursor-pointer hover:bg-primary-base border-neutral-300;
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