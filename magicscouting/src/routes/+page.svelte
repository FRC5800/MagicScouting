<script>
	// @ts-nocheck
	import '../app.css';
	import '$lib/assets/App_Title.svg';
	
	import { _ } from 'svelte-i18n'
	import { App } from '@capacitor/app';
	import { goto } from '$app/navigation';
	import { useDB }  from '$lib/shared/stores/dataBase';
	import dataBase from '$lib/shared/stores/dataBase';
	
  import Modal from '$lib/components/Modal.svelte';
	import MenuBar from './MenuBar.svelte';
	import storeData from "$lib/shared/scripts/controlData.js";
	import MenuOptions from './MenuOptions.svelte';
	import ConfigOptions from './ConfigOptions.svelte';
	import DataBaseAlert from './DataBaseAlert.svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';

	$: alliance = $_('home_page.alliance.option_blue');

	let showModal = false;
	let showConfig = false;
	let showDataBase = false;

	let team_number = '';
	let match_number = '';
	let team_position = '';
	let validationError = false;
	let isDataBaseSet;
	$: if ($dataBase != '' && $dataBase != '?' || !$useDB) {
		isDataBaseSet = true;
	} else {
		showModal = true;
		isDataBaseSet = false;
	}
	
	App.addListener("backButton", ()=>{showModal = false, showConfig = false});
	
	async function onSubmit() {
		if(team_number == '' || match_number == '' || team_position == 0) {
			validationError = true;
		}else {
			validationError = false;
			const teamData = { "red/blue": alliance.toLocaleLowerCase() == "azul" || alliance.toLocaleLowerCase() == "blue" ? "BLUE" : "RED", team:team_number, match:match_number, arenaPos:team_position};
			storeData(teamData);
			goto('/autonomous');
		}
	}

	let positions = [
		{ id: '1', content: '1', value: '1' },
		{ id: '2', content: '2', value: '2' },
		{ id: '3', content: '3', value: '3' }
	];
	let showMorePositions = 'hidden';
	let inicialPosition = 0;

	$: console.log(team_position);

</script>

<section class="pt-2">

	<header>	
<svg xmlns="http://www.w3.org/2000/svg" class="dark:fill-white scale-[1.2]" xmlns:xlink="http://www.w3.org/1999/xlink" width="80vw" zoomAndPan="magnify" viewBox="0 0 224.87999 74.999997" height="90" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><g/></defs><g class="fill-primary-base dark:fill-primary-base" fill-opacity="1"><g transform="translate(-0.657527, 48.081926)"><g><path d="M 17.34375 -5.1875 L 10.296875 -14.234375 L 7.15625 0 L 1.15625 0 L 7.15625 -26.796875 L 17.34375 -13.625 L 27.515625 -26.796875 L 33.515625 0 L 27.515625 0 L 24.375 -14.234375 Z M 17.34375 -5.1875 "/></g></g></g><g fill-opacity="1"><g transform="translate(52.39695, 48.175506)"><g/></g><g transform="translate(57.186879, 48.175506)"><g/></g><g transform="translate(61.976808, 48.175506)"><g/></g><g transform="translate(66.766737, 48.175506)"><g/></g><g transform="translate(71.556666, 48.175506)"><g/></g><g transform="translate(76.346595, 48.175506)"><g/></g><g transform="translate(81.136525, 48.175506)"><g/></g><g transform="translate(85.926454, 48.175506)"><g/></g><g transform="translate(90.716383, 48.175506)"><g/></g><g transform="translate(95.506312, 48.175506)"><g/></g><g transform="translate(100.296241, 48.175506)"><g/></g><g transform="translate(105.08617, 48.175506)"><g/></g><g transform="translate(109.8761, 48.175506)"><g/></g><g transform="translate(114.666029, 48.175506)"><g/></g></g><g fill-opacity="1"><g transform="translate(119.455958, 48.175506)"><g><path d="M 2.4375 -14.859375 L 16 -14.859375 L 16 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 16 -2.921875 L 16 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g><g transform="translate(136.115331, 48.175506)"><g><path d="M 14.234375 -14.859375 C 14.710938 -14.859375 15.125 -14.679688 15.46875 -14.328125 C 15.820312 -13.984375 16 -13.570312 16 -13.09375 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.957031 0 1.539062 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.539062 -14.679688 1.957031 -14.859375 2.4375 -14.859375 Z M 12.515625 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 12.515625 -2.921875 Z M 12.515625 -11.9375 "/></g></g><g transform="translate(152.784285, 48.175506)"><g><path d="M 12.5 -14.859375 L 16 -14.859375 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 -2.921875 L 12.5 -2.921875 Z M 12.5 -14.859375 "/></g></g><g transform="translate(169.443658, 48.175506)"><g><path d="M 16 -14.859375 L 16 -11.9375 L 10.078125 -11.9375 L 10.078125 0 L 6.578125 0 L 6.578125 -11.9375 L 0.671875 -11.9375 L 0.671875 -14.859375 Z M 16 -14.859375 "/></g></g><g transform="translate(186.103031, 48.175506)"><g><path d="M 0.671875 0 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 0 Z M 0.671875 0 "/></g></g><g transform="translate(190.93128, 48.175506)"><g><path d="M 4.15625 -8.515625 L 4.15625 0 L 0.671875 0 L 0.671875 -15.578125 L 12.5 -6.34375 L 12.5 -14.859375 L 16 -14.859375 L 16 0.71875 Z M 4.15625 -8.515625 "/></g></g><g transform="translate(207.590653, 48.175506)"><g><path d="M 2.4375 -14.859375 L 15.125 -14.859375 L 15.125 -11.9375 L 4.15625 -11.9375 L 4.15625 -2.921875 L 12.5 -2.921875 L 12.5 -5.96875 L 9 -5.96875 L 9 -8.890625 L 16 -8.890625 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g></g><g class="fill-primary-base dark:fill-primary-base" fill-opacity="1"><g transform="translate(34.668262, 48.175506)"><g><path d="M 2.4375 -14.859375 L 14.234375 -14.859375 C 14.710938 -14.859375 15.125 -14.679688 15.46875 -14.328125 C 15.820312 -13.984375 16 -13.570312 16 -13.09375 L 16 0 L 12.5 0 L 12.5 -4.515625 L 4.171875 -4.515625 L 4.171875 0 L 0.671875 0 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 12.5 -7.421875 L 12.5 -11.9375 L 4.171875 -11.9375 L 4.171875 -7.421875 Z M 12.5 -7.421875 "/></g></g><g transform="translate(51.337215, 48.175506)"><g><path d="M 2.4375 -14.859375 L 15.125 -14.859375 L 15.125 -11.9375 L 4.15625 -11.9375 L 4.15625 -2.921875 L 12.5 -2.921875 L 12.5 -5.96875 L 9 -5.96875 L 9 -8.890625 L 16 -8.890625 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g><g transform="translate(67.996589, 48.175506)"><g><path d="M 0.671875 0 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 0 Z M 0.671875 0 "/></g></g><g transform="translate(72.824837, 48.175506)"><g><path d="M 2.4375 -14.859375 L 16 -14.859375 L 16 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 16 -2.921875 L 16 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g></g><g fill-opacity="1"><g transform="translate(91.210323, 48.081926)"><g><path d="M 4.203125 -25.546875 L 26.015625 -25.546875 L 26.015625 -20.515625 L 7.171875 -20.515625 L 7.171875 -15.296875 L 24.484375 -15.296875 C 25.304688 -15.296875 26.015625 -14.992188 26.609375 -14.390625 C 27.210938 -13.785156 27.515625 -13.070312 27.515625 -12.25 L 27.515625 -3.03125 C 27.515625 -2.195312 27.210938 -1.484375 26.609375 -0.890625 C 26.015625 -0.296875 25.304688 0 24.484375 0 L 1.15625 0 L 1.15625 -5.03125 L 21.5 -5.03125 L 21.5 -10.265625 L 4.203125 -10.265625 C 3.367188 -10.265625 2.648438 -10.5625 2.046875 -11.15625 C 1.453125 -11.75 1.15625 -12.460938 1.15625 -13.296875 L 1.15625 -22.515625 C 1.15625 -23.335938 1.453125 -24.046875 2.046875 -24.640625 C 2.648438 -25.242188 3.367188 -25.546875 4.203125 -25.546875 Z M 4.203125 -25.546875 "/></g></g></g></svg>
	</header>

	<div class="mt-0 separator"></div>

	<hr />

	<form id="team-info" class="w-4/5 team_info" on:forminput={() => {console.log('erro')}} on:submit|preventDefault={onSubmit}>
		<div class="flex flex-row items-center justify-center center-container">
			<label class="relative flex flex-row items-center cursor-pointer alliance-check">
				<input
					type="checkbox"
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
					class="text-sm font-medium text-[#474747] dark:text align-middle ms-3 dark:text-gray-300 min-w-32"
					>{$_('home_page.alliance.title')}: {alliance}</span
				>
			</label>
		</div> 

		<div class="flex flex-col justify-center items-center">
			<label for="team_number" class="home-label mb-2 in">{$_('home_page.team_number')}</label>
			<input bind:value={team_number} name="team_number" type="number" class="input input-bordered w-full {((validationError) && (team_number == '')) ? 'validation-error' : ''}" placeholder="{$_('home_page.team_number')}" />
			<span class="validation-error-message {((validationError) && (team_number == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<div class="flex flex-col justify-center items-center">
			<label for="match_number" class="home-label mb-2">{$_('home_page.match_number')}</label>
			<input bind:value={match_number} name="match_number" type="number" class="input input-bordered w-full {((validationError) && (match_number == '')) ? 'validation-error' : ''}" placeholder="{$_('home_page.match_number')}" />
			<span class="validation-error-message {((validationError) && (match_number == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<div class="">
			<label for="team_position" class="home-label mb-2">{$_('home_page.team_position')}</label>
			<!-- <input bind:value={team_position} name="team_position" type="number" class="home-inp {((validationError) && (team_position == '')) ? 'validation-error' : ''}" placeholder="1, 2 ou 3" /> -->
			<SelectInput
			name={"position"}
			options={positions}
			bind:value={team_position}
			/>
			<span class="validation-error-message {((validationError) && (team_position == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<button class="w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons {(!isDataBaseSet || isDataBaseSet =='setting') ? 'bg-gray-600 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-600 btn-disabled' : ''}" type="submit" disabled={!isDataBaseSet || isDataBaseSet == 'setting'}> {$_('home_page.continue_button')} </button>
	</form>
</section>

<Modal bind:showModal bind:showConfig bind:showDataBase>
	{#if showModal && !showConfig && isDataBaseSet}
		<MenuOptions bind:showDataBase={showDataBase}
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
	{:else if (showConfig)}
		<ConfigOptions />
	{:else if showModal && !showConfig && !isDataBaseSet}
		<DataBaseAlert bind:isDataBaseSet={isDataBaseSet} bind:showDataBaseSelector={showDataBase} bind:showModal={showModal}/>
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
		align-items: center;
		flex: 0.6;
	}

	span {
		font-family: 'Outfit', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 15px;
	}
	.validation-error {
   		@apply outline empty:outline-redTheme-600;
	}
	.validation-error-message {
   		@apply text-red-300 font-medium ml-2;
	}
	option{
		@apply text-base;
	}

</style>
