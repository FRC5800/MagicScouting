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
	<!-- <button
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
	</div> -->

	<button class="cta absolute bottom-[10%] right-[5%] self-end" onclick={onSubmit}>
		<span class="span">{$_('autonomous.continue_button')}</span>
		<span class="second">
			<svg
				width="50px"
				height="20px"
				viewBox="0 0 66 43"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<g
					id="arrow"
					stroke="none"
					stroke-width="1"
					fill="none"
					fill-rule="evenodd"
				>
					<path
						class="one"
						d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
						fill="#FFFFFF"
					></path>
					<path
						class="two"
						d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
						fill="#FFFFFF"
					></path>
					<path
						class="three"
						d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
						fill="#FFFFFF"
					></path>
				</g>
			</svg>
		</span>
	</button>
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
