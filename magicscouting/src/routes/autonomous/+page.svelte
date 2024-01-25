<script>
	import '../.././app.css';
	import { goto } from '$app/navigation';
	import speaker from '$lib/assets/speaker.png';
	import amp from '$lib/assets/amp.png';
	import { _ } from 'svelte-i18n';
	import storeData from "$lib/shared/scripts/controlData.js";

	function onSubmit() {
		storeData({"autoAmpScore": ampScoreAuto, "autoAmpMiss": ampMissAuto, "autoSpeakerScore": speakerScoreAuto, "autoSpeakerMiss": speakerMissAuto, "isLeave": leave ? 1 : 0});
		goto('/teleop');
	}
	let points = 0;

	//SPEAKER VALUES
	let speakerScoreAuto = 0;
	let speakerMissAuto = 0;

	//AMP VALUES
	let ampScoreAuto = 0;
	let ampMissAuto = 0;

	//LEAVE VALUE
	$: leave = false;

	function handleLeave() {
		leave = !leave;
	}
</script>

<section class="text-neutral-600 dark:text-white mt-[3vh] flex flex-col items-center">
	<h1 class="text-4xl header">{$_('autonomous.title')}</h1>
	<div class="separator"></div>

	<h2 class="text-[1.5rem]">{$_('autonomous.speaker')}</h2>
	<div class="container">
		<div class="image">
			<img class="speaker-img" src={speaker} alt="" />
		</div>
		<div class="scores">
			<h4>{$_('autonomous.scores')}</h4>
			<button
				class="points"
				on:click={() => {
					speakerScoreAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					if (speakerScoreAuto != 0) speakerScoreAuto -= 1;
				}}>-</button
			>
			<p>{speakerScoreAuto}</p>
		</div>
		<div class="miss">
			<h4>{$_('autonomous.misses')}</h4>
			<button
				class="points"
				on:click={() => {
					speakerMissAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					if (speakerMissAuto != 0) speakerMissAuto -= 1;
				}}>-</button
			>
			<p>{speakerMissAuto}</p>
		</div>
	</div>

	<h2 class="text-[1.5rem]">{$_('autonomous.amp')}</h2>
	<div class="container">
		<div class="image">
			<img class="amp-img" src={amp} alt="" />
		</div>
		<div class="scores">
			<h4>{$_('autonomous.scores')}</h4>
			<button
				class="points"
				on:click={() => {
					ampScoreAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					if (ampScoreAuto != 0) ampScoreAuto -= 1;
				}}>-</button
			>
			<p>{ampScoreAuto}</p>
		</div>
		<div class="miss">
			<h4>{$_('autonomous.misses')}</h4>
			<button
				class="points"
				on:click={() => {
					ampMissAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					if (ampMissAuto != 0) ampMissAuto -= 1;
				}}>-</button
			>
			<p>{ampMissAuto}</p>
		</div>
	</div>
	<button
		on:click={handleLeave}
		id="leave"
		class="leave p-2 rounded-xl box-border border-2 dark:border-0 {leave
			? ' text-white bg-primary-base border-primary-base'
			: 'text-neutral-600 bg-transparent dark:bg-slate-100 border-gray-700'}">{$_('autonomous.leave_button')}</button
	>

	<button class="max-w-[50%] w-[50vw] btn mt-8" on:click={onSubmit}> {$_('autonomous.continue_button')} </button>
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
		width: 60%;
	}

	.speaker-img {
		width: 100%;
	}
	.amp-img {
		width: 75%;
	}
	.container {
		@apply border-[1px] border-black dark:border-neutral-200 rounded-md mb-3 p-3 flex flex-row justify-around w-[80%];
	}

	.container > div {
		text-align: center;
		width: 25%;
	}

	.image {
		@apply w-[25%] flex justify-center items-center;
	}

	.leave {
		width: 40%;
		font-size: 20px;
		font-weight: 600;
		justify-content: center;
		text-align: center;
	}
</style>
