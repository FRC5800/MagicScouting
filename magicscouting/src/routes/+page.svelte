<script>
	// @ts-nocheck
	import '../app.css';
	import logo from '$lib/assets/App_Title.svg';
	import '$lib/assets/App_Title.svg';

	import MenuBar from './MenuBar.svelte';
	import Modal from './Modal.svelte';
	import MenuOptions from './MenuOptions.svelte';
	import ConfigOptions from './ConfigOptions.svelte';

	import { goto } from '$app/navigation';

	import { _ } from 'svelte-i18n'
	// import { enhance } from '$app/forms';
	// import { fade } from 'svelte/transition';

	// async function onSubmit(data) {
	// 	if(team_number == '' || match_number == '' || team_position == '') {
	// 		validationError = true;
	// 	}else {
	// 		validationError = false;
	// 		const formDict = Object.assign({}, { alliance: alliance }, formToDict(data));
	// 		console.log(formDict);
	// 		storeData(formDict);
	// 		goto('/autonomous');
	// 	}
	// }
	// function formToDict(a) {
	// 	const formData = new FormData(a.target);
	// 	const data = {};
	// 	for (let field of formData) {
	// 		const [key, value] = field;
	// 		data[key] = value;
	// 	}
	// 	return data;
	// }
	// function storeData(payload) {
	// 	for (var key in payload) {
	// 		// sessionStorage.setItem(key, payload[key]);
	// 	}
	// }
	// function getData(key) {
	// 	// return sessionStorage.getItem(key);
	// }
	let alliance = $_('home_page.alliance.option_blue');
	$: if(alliance != $_('home_page.alliance.option_blue') && alliance != $_('home_page.alliance.option_red')) {
		switch (alliance) {
			case 'Blue':
				alliance = $_('home_page.alliance.option_blue')
				break
			case 'Azul':
				alliance = $_('home_page.alliance.option_blue')
				break
			case 'Red':
				alliance = $_('home_page.alliance.option_red')
				break
			case 'Vermelha':
				alliance = $_('home_page.alliance.option_red')
		}
	}

	let showModal = false;
	let showConfig = false;

	let team_number = '';
	let match_number = '';
	let team_position = '';
	let validationError = false;
	
	// const awaitReload = new Promise((resolve, reject) => {
	// 	setTimeout(() => {
	// 		resolve('foo');
	// 	}, 300);
	// });
</script>

<!-- {#await awaitReload}
	<div out:fade={{ delay: 0, duration: 500 }} class="loader"></div>
{/await} -->

<section>
	<MenuBar
		on:keydown={(e) => {
			showModal = e.key == 'Enter' ? true : false;
		}}
		on:click={() => {
			showModal = true;
		}}
	/>
	<header>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-1 stroke-black fill-[#666666] dark:stroke-none dark:fill-white"
			stroke="black"
			stroke-width="1"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			width="300"
			zoomAndPan="magnify"
			viewBox="0 0 224.87999 74.999997"
			height="100"
			preserveAspectRatio="xMidYMid meet"
			version="1.0"
			><defs><g /></defs><g fill-opacity="1"
				><g transform="translate(12.320843, 53.744913)"
					><g
						><path
							d="M 1.828125 -40.5 L 41.234375 -40.5 L 41.234375 -32.53125 L 11.34375 -32.53125 L 11.34375 -24.25 L 38.796875 -24.25 C 40.109375 -24.25 41.238281 -23.769531 42.1875 -22.8125 C 43.132812 -21.851562 43.609375 -20.722656 43.609375 -19.421875 L 43.609375 -4.8125 C 43.609375 -3.488281 43.132812 -2.351562 42.1875 -1.40625 C 41.238281 -0.46875 40.109375 0 38.796875 0 L 6.640625 0 C 5.316406 0 4.179688 -0.46875 3.234375 -1.40625 C 2.296875 -2.351562 1.828125 -3.488281 1.828125 -4.8125 L 1.828125 -12.3125 L 11.34375 -12.3125 L 11.34375 -7.96875 L 34.09375 -7.96875 L 34.09375 -16.28125 L 6.640625 -16.28125 C 5.316406 -16.28125 4.179688 -16.75 3.234375 -17.6875 C 2.296875 -18.625 1.828125 -19.757812 1.828125 -21.09375 Z M 1.828125 -40.5 "
						/></g
					></g
				></g
			><g fill-opacity="1"
				><g transform="translate(58.738373, 53.154522)"
					><g
						><path
							d="M 3.859375 -23.546875 L 25.359375 -23.546875 L 25.359375 -18.90625 L 6.609375 -18.90625 L 6.609375 -4.640625 L 25.359375 -4.640625 L 25.359375 0 L 3.859375 0 C 3.085938 0 2.425781 -0.269531 1.875 -0.8125 C 1.332031 -1.363281 1.0625 -2.023438 1.0625 -2.796875 L 1.0625 -20.75 C 1.0625 -21.507812 1.332031 -22.164062 1.875 -22.71875 C 2.425781 -23.269531 3.085938 -23.546875 3.859375 -23.546875 Z M 3.859375 -23.546875 "
						/></g
					></g
				><g transform="translate(85.149282, 53.154522)"
					><g
						><path
							d="M 22.578125 -23.546875 C 23.335938 -23.546875 23.992188 -23.269531 24.546875 -22.71875 C 25.097656 -22.164062 25.375 -21.507812 25.375 -20.75 L 25.375 -2.796875 C 25.375 -2.023438 25.097656 -1.363281 24.546875 -0.8125 C 23.992188 -0.269531 23.335938 0 22.578125 0 L 3.875 0 C 3.101562 0 2.441406 -0.269531 1.890625 -0.8125 C 1.335938 -1.363281 1.0625 -2.023438 1.0625 -2.796875 L 1.0625 -20.75 C 1.0625 -21.507812 1.335938 -22.164062 1.890625 -22.71875 C 2.441406 -23.269531 3.101562 -23.546875 3.875 -23.546875 Z M 19.84375 -18.90625 L 6.609375 -18.90625 L 6.609375 -4.640625 L 19.84375 -4.640625 Z M 19.84375 -18.90625 "
						/></g
					></g
				><g transform="translate(111.575378, 53.154522)"
					><g
						><path
							d="M 19.828125 -23.546875 L 25.359375 -23.546875 L 25.359375 -2.796875 C 25.359375 -2.023438 25.082031 -1.363281 24.53125 -0.8125 C 23.988281 -0.269531 23.332031 0 22.5625 0 L 3.859375 0 C 3.085938 0 2.425781 -0.269531 1.875 -0.8125 C 1.332031 -1.363281 1.0625 -2.023438 1.0625 -2.796875 L 1.0625 -23.546875 L 6.59375 -23.546875 L 6.59375 -4.640625 L 19.828125 -4.640625 Z M 19.828125 -23.546875 "
						/></g
					></g
				><g transform="translate(137.986287, 53.154522)"
					><g
						><path
							d="M 25.359375 -23.546875 L 25.359375 -18.90625 L 15.984375 -18.90625 L 15.984375 0 L 10.4375 0 L 10.4375 -18.90625 L 1.0625 -18.90625 L 1.0625 -23.546875 Z M 25.359375 -23.546875 "
						/></g
					></g
				><g transform="translate(164.397196, 53.154522)"
					><g
						><path
							d="M 1.0625 0 L 1.0625 -23.546875 L 6.59375 -23.546875 L 6.59375 0 Z M 1.0625 0 "
						/></g
					></g
				><g transform="translate(172.051651, 53.154522)"
					><g
						><path
							d="M 6.59375 -13.484375 L 6.59375 0 L 1.0625 0 L 1.0625 -24.703125 L 19.828125 -10.0625 L 19.828125 -23.546875 L 25.359375 -23.546875 L 25.359375 1.140625 Z M 6.59375 -13.484375 "
						/></g
					></g
				><g transform="translate(198.46256, 53.154522)"
					><g
						><path
							d="M 3.859375 -23.546875 L 23.96875 -23.546875 L 23.96875 -18.90625 L 6.59375 -18.90625 L 6.59375 -4.640625 L 19.828125 -4.640625 L 19.828125 -9.46875 L 14.28125 -9.46875 L 14.28125 -14.09375 L 25.359375 -14.09375 L 25.359375 -2.796875 C 25.359375 -2.023438 25.082031 -1.363281 24.53125 -0.8125 C 23.976562 -0.269531 23.320312 0 22.5625 0 L 3.859375 0 C 3.085938 0 2.425781 -0.269531 1.875 -0.8125 C 1.332031 -1.363281 1.0625 -2.023438 1.0625 -2.796875 L 1.0625 -20.75 C 1.0625 -21.507812 1.332031 -22.164062 1.875 -22.71875 C 2.425781 -23.269531 3.085938 -23.546875 3.859375 -23.546875 Z M 3.859375 -23.546875 "
						/></g
					></g
				></g
			><g fill-opacity="1"
				><g transform="translate(2.325844, 53.154522)"
					><g
						><path
							d="M 1.0625 0 L 1.0625 -23.546875 L 6.59375 -23.546875 L 6.59375 0 Z M 1.0625 0 "
						/></g
					></g
				></g
			></svg
		>
		<!-- <img src={logo} alt="logo"> -->
	</header>

	<div class="separator"></div>

	<hr />

	<form id="team-info" class="w-4/5 team_info" on:forminput={() => {console.log('erro')}}>
		<div class="center-container">
			<label class="relative inline-flex cursor-pointer alliance-check">
				<input
					type="checkbox"
					bind:value={alliance}
					class="align-middle sr-only peer"
					name="alliance"
					on:click={(a) => {
						alliance = alliance == $_('home_page.alliance.option_blue') ? $_('home_page.alliance.option_red') : $_('home_page.alliance.option_blue');
					}}
				/>
				<div
					class="w-11 h-6 align-middle bg-blue-600 rounded-full peer peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-blue-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"
				></div>
				<span
					class="text-sm font-medium text-[#474747] dark:text align-middle ms-3 dark:text-gray-300"
					>{$_('home_page.alliance.title')}: {alliance}</span
				>
			</label>
		</div>

		<div class="">
			<label for="team_number" class="home-label in">{$_('home_page.team_number')}</label>
			<input bind:value={team_number} name="team_number" type="text" class="home-inp {((validationError) && (team_number == '')) ? 'validation-error' : ''}" placeholder="5800" />
			<span class="validation-error-message {((validationError) && (team_number == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<div class="">
			<label for="match_number" class="home-label">{$_('home_page.match_number')}</label>
			<input bind:value={match_number} name="match_number" type="text" class="home-inp {((validationError) && (match_number == '')) ? 'validation-error' : ''}" placeholder="32" />
			<span class="validation-error-message {((validationError) && (match_number == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<div class="">
			<label for="team_position" class="home-label">{$_('home_page.team_position')}</label>
			<input bind:value={team_position} name="team_position" type="text" class="home-inp {((validationError) && (team_position == '')) ? 'validation-error' : ''}" placeholder="1, 2 ou 3" />
			<span class="validation-error-message {((validationError) && (team_position == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
	</form>
    <button class="w-full submit_team_info btn" on:click={() => {goto('/autonomous')}}> {$_('home_page.continue_button')} </button>

	<div class="separator"></div>

	<!-- <div >
		<label for="team_position" class="text-sm home-label" >Pesquisa na base de dados local</label>
		<input name="team_position" type="text" class="home-inp " placeholder="digite a partida #">	
		<button class="btn" type="submit">
			Pesquisar
		</button>
	</div>
		-->
</section>

<Modal bind:showModal bind:showConfig>
	{#if showModal && !showConfig}
		<MenuOptions
			on:keydown={(e) => {
				if (e.key == 'Enter') {
					showConfig = true;
					showModal = false;
				}
			}}
			on:click={() => {
				showConfig = true;
				showModal = false;
			}}
		/>
	{:else}
		<ConfigOptions />
	{/if}
</Modal>

<style lang='postcss'>
	header {
		color: white;
		font-weight: 900;
		font-size: 50px;
	}
	.center-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 10px;
	}

	section {
		margin-top: 1em;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	span {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 15px;
	}

	.loader {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #333333;
		z-index: 1;
	}

	.loader::after {
		content: '';
		width: 50px;
		height: 50px;
		border: 10px solid #dddddd;
		border-top-color: #009578;
		border-radius: 50%;
		animation: loading 0.75s ease infinite;
	}

	@keyframes loading {
		from {
			transform: rotate(0turn);
		}
		to {
			transform: rotate(1turn);
		}
	}

	.validation-error {
   		@apply outline outline empty:outline-redTheme-600;
	}
	.validation-error-message {
   		@apply text-red-300 font-medium ml-2;
	}
</style>
