<script>
	// @ts-nocheck

	import '../.././app.css';
	import { goto } from '$app/navigation';
	import SelectInput from '$lib/components/SelectInput.svelte';

	let ampSpeakerStructure = [
		{title: 'Speaker', score: 0, miss: 0},
		{title: 'Speaker amplified', score: 0, miss: null},
		{title: 'Amp', score: 0, miss: 0},
	]

	let TimerOptions = [
		{ id: '1', content: 'Chão', value: 'floor', handler: handleFloor },
		{ id: '2', content: 'Source', value: 'source', handler: handleSource}
	];
	let selected_timer;
	let showMoreTimers = 'hidden';

	function handle_selection() {

	}

	let highNoteOptions = [
		{ id: '1', content: 'Another teams Human Player', value: '-1' },
		{ id: '2', content: '0', value: '0' },
		{ id: '3', content: '1', value: '1' },
		{ id: '4', content: '2', value: '2' },
		{ id: '5', content: '3', value: '3' }
	];
	let showMoreHighNotes = 'hidden';

	let chainOptions = [
		{ id: '1', content: 'Tried and missed', value: '-1' },
		{ id: '2', content: "Didn't try", value: '0' },
		{ id: '3', content: 'Climbed alone', value: '1' },
		{ id: '4', content: 'Climbed with 1 more robot', value: '2' },
		{ id: '5', content: 'Climbed with 2 more robots', value: '3' }
	];
	let showMoreChain = 'hidden';

	let trapOptions = [
		{ id: '1', content: "Dind't try", value: '0' },
		{ id: '2', content: 'Missed', value: '-1' },
		{ id: '3', content: 'Scored', value: '1' }
	];
	let showMoreTrap = 'hidden';
	/**
	//  * @param {string} key
	//  */
	// function getData(key) {
	// 	return localStorage.getItem(key);
	// }
	// /**
	//  * @param {{ [x: string]: any }} payload
	//  */
	// function storeData(payload) {
	// 	for (var key in payload) {
	// 		localStorage.setItem(key, payload[key]);
	// 	}
	// }
	function onSubmit() {
		// storeData({
		// 	 	"teleopAmpScore": ampScoreTeleop,
		// 		"teleopAmpMiss": ampMissTeleop,
		// 		"teleopSpeakerScore": speakerScoreTeleop,
		// 		"teleopSpeakerMiss": speakerMissTeleop,
		// 		"speakerAmplifiedScore":speakerAmplifiedScore,
		// 		"trapStatus":selected_trap.value,
		// 		"onStageStatus": selected_chain.value,
		// 		"onStageTime": onstageCicle,
		// 		"sourceCycleTime": JSON.stringify(sourceCicle).replaceAll("[", "").replaceAll("]", ""),
		// 		"floorCycleTime":JSON.stringify(floorCicle).replaceAll("[", "").replaceAll("]", ""),
		// 		"highNoteStatus": selected_highNote.value,
		// 		});
		goto('/Info');
	}

	let selected_chain;
	let selected_highNote;
	let selected_trap;


	//VARIAVEIS DE SPEAKER
	let speakerScoreTeleop = 0;
	let speakerMissTeleop = 0;
	let speakerAmplifiedScore = 0;

	//VARIAVEIS DE AMP
	let ampScoreTeleop = 0;
	let ampMissTeleop = 0;

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
		floorCicle.push(noteCicle.toFixed(1));
		noteCicle = 0;
		console.log(floorCicle);
	}
	function handleSource() {
		sourceCicle.push(noteCicle.toFixed(1));
		noteCicle = 0;
		console.log(sourceCicle);
	}
	function handleOnstage() {
		onstageCicle = 0;
	}

	let coopertition = false;
	function handleCoopertition() {
		coopertition = !coopertition;
		let el = document.getElementById('coopertition');
		if (coopertition) {
			//el aparece com erro mas ta dando certo
			el.style.cssText = 'color: #060024;' + 'background-color: white;';
		} else {
			el.style.cssText = 'color: white;' + 'background-color: #262223;';
		}
	}

</script>

<main class="mt-[3vh] dark:text-white text-neutral-600">
	<h1 class="text-4xl font-[Lucida Sans]">Teleoperado</h1>

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
							<p class="label">Scores</p>
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
									item.score -= 1;
								}}
								class="points">-</button
							>
							</div>

						</div>
						<div class="plusMinusBlock">
							<p class="label">Misses</p>
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
										item.miss != null ? item.miss -= 1 : ampSpeakerStructure[0].miss -= 1;
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
			<h4>Cicle Time</h4>
			<div class="flex flex-col items-center justify-center w-full">
				<div class="flex flex-row items-center border-[3px] border-[#494462] rounded-xl {!noteCicleCouting ? 'justify-between w-4/5' : 'justify-center w-1/3 border-b-0 rounded-b-none	'} overflow-auto">
					<div class="text-center {!noteCicleCouting ? 'border-r border-black w-1/2' : ''}">
						<p class="{!noteCicleCouting ? 'p-2' : ''}"><b> {noteCicle.toFixed(1)} </b></p>
					</div>
					{#if !noteCicleCouting}
						<div role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") startNoteCicle()}} on:click={startNoteCicle} class="startCicle">
							<p class="">Start</p>
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

	<h3>End Game</h3>
	<div class="separator"></div>
	<div class="select-holder flex flex-col items-center">
		<div class="highNote w-3/4">
			<h4 class="label-endgame">High Notes</h4>
			<SelectInput
				options={highNoteOptions}
				bind:opcaoSelecionada={selected_highNote}
				showMore={showMoreHighNotes}
				componentId={"highNote"}
			/>
		</div>

		<div class="trap w-3/4">
			<h4 class="label-endgame">Trap</h4>
			<SelectInput
				options={chainOptions}
				bind:opcaoSelecionada={selected_chain}
				showMore={showMoreChain}
				componentId={"chain"}
			/>
		</div>
		<div class="chain w-3/4">
			<h4 class="label-endgame">Chain</h4>
			<SelectInput
				options={trapOptions}
				bind:opcaoSelecionada={selected_trap}
				showMore={showMoreTrap}
				componentId={"trap"}
			/>
		</div>
	</div>

	<div class="cicleOnstage flex flex-col justify-center items-center">
		<h4 class="time-onstage-title">Onstage Time</h4>
		<div class="flex flex-row items-center justify-between w-4/5 overflow-auto border-[3px] border-[#494462] rounded-xl">
			<div class="w-1/2 text-center border-r border-black">
				<p class="p-2"><b> {onstageCicle.toFixed(1)} </b></p>
			</div>
			{#if !onstageCicleCouting}
				<div role="button" tabindex="0" on:keydown={(e) => {if (e.key == "Enter") startOnstageCicle()}} on:click={startOnstageCicle} class="startCicle">
					<p class="">Start</p>
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
		<button on:click={onSubmit} class="btn w-2/3 p-2 mt-8">Continuar</button>
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
		@apply bg-blue-400 transition-all duration-[0.15s] ease-in-out active:scale-90;
		width: 50%;
		margin: 0;
		font-size: 30px;
		text-align: center;
	}
	.count{
		@apply w-[50%] bg-blue-500 rounded-2xl text-white;
	}
	.cicle {
		@apply w-1/2 min-h-[150px];
	}
	.startCicle{
		@apply  w-1/2 h-full p-2 border-l cursor-pointer hover:bg-blue-500 border-neutral-300;
	}

	.separator {
		height: 2px;
		background: linear-gradient(to right, #5de0e6, #004aad) !important;
		margin-top: 6px;
		margin-bottom: 10px;
		width: 60%;
		margin-left: 20%;
	}
</style>