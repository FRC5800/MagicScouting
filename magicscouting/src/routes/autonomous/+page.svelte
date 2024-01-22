<script>
	import '../.././app.css';
	import { goto } from '$app/navigation';
	import speaker from '$lib/assets/speaker.png';
	import amp from '$lib/assets/amp.png';

	// /**
	//  * @param {string} key
	//  */
	// function getData(key) {
	// 	// return sessionStorage.getItem(key);
	// }
	// /**
	//  * @param {{ [x: string]: any }} payload
	//  */
	// function storeData(payload) {
	// 	for (var key in payload) {
	// 		// sessionStorage.setItem(key, payload[key]);
	// 	}
	// }
	// function onSubmit() {
	// 	storeData({ AutoPoints: points });
	// 	goto('/teleop');
	// }
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
		// let el = document.getElementById('leave');
		// if (leave) {
		// 	//el aparece com erro mas ta dando certo
		// 	// @ts-ignore
		// 	el.style.cssText = 'color: #060024;' + 'background-color: white;';
		// } else {
		// 	// @ts-ignore
		// 	el.style.cssText = 'color: white;' + 'background-color: #262223;';
		// }
	}
</script>

<section class="text-neutral-600 dark:text-white mt-[3vh] flex flex-col items-center">
	<h1 class="text-4xl header">Autonomous</h1>
	<div class="separator"></div>

	<h2 class="text-[1.5rem]">Speaker</h2>
	<div class="container">
		<div class="image">
			<img class="speaker-img" src={speaker} alt="" />
		</div>
		<div class="scores">
			<h4>Scores</h4>
			<button
				class="points"
				on:click={() => {
					speakerScoreAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					speakerScoreAuto -= 1;
				}}>-</button
			>
			<p>{speakerScoreAuto}</p>
		</div>
		<div class="miss">
			<h4>Misses</h4>
			<button
				class="points"
				on:click={() => {
					speakerMissAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					speakerMissAuto -= 1;
				}}>-</button
			>
			<p>{speakerMissAuto}</p>
		</div>
	</div>

	<h2 class="text-[1.5rem]">Amp</h2>
	<div class="container">
		<div class="image">
			<img class="amp-img" src={amp} alt="" />
		</div>
		<div class="scores">
			<h4>Scores</h4>
			<button
				class="points"
				on:click={() => {
					ampScoreAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					ampScoreAuto -= 1;
				}}>-</button
			>
			<p>{ampScoreAuto}</p>
		</div>
		<div class="miss">
			<h4>Misses</h4>
			<button
				class="points"
				on:click={() => {
					ampMissAuto += 1;
				}}>+</button
			>
			<button
				class="points"
				on:click={() => {
					ampMissAuto -= 1;
				}}>-</button
			>
			<p>{ampMissAuto}</p>
		</div>
	</div>
	<button
		on:click={handleLeave}
		id="leave"
		class="leave p-2 rounded-xl {leave
			? 'border-0 text-white bg-blueTheme-500 '
			: 'text-neutral-600 bg-transparent border-[1px] dark:bg-blueTheme-100'}">Leave</button
	>

	<button class="max-w-[50%] w-[50vw] btn mt-8" on:click={() => {goto('/teleop')}}> Continuar </button>
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
		@apply flex items-center justify-center w-full h-9 border-[1px] border-black dark:border-neutral-600 rounded-md bg-transparent dark:bg-neutral-200 text-neutral-600 hover:text-neutral-800 active:bg-blueTheme-500;
		font-size: 40px;
		font-weight: 700;
		text-align: center;
	}

	.separator {
		@apply my-3;
		height: 2px;
		background: linear-gradient(to right, #5de0e6, #004aad) !important;
		width: 60%;
	}

	.speaker-img {
		width: 100%;
	}
	.amp-img {
		width: 75%;
	}
	.container {
		@apply border-[1px] border-black dark:border-neutral-200 rounded-md mb-4 p-3 flex flex-row justify-around w-[80%];
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
