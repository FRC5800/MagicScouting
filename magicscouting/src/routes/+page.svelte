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
	let team_position = 0;
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
			const teamData = { "red/blue": alliance.toLocaleLowerCase() == "azul" || alliance.toLocaleLowerCase() == "blue" ? "BLUE" : "RED", team:team_number, match:match_number, arenaPos:team_position.value};
			storeData(teamData);
			goto('/autonomous');
		}
	}

	// options={positions}
	// 		inicialOption={inicialPosition}
	// 		bind:SelectedOption={selected_position}
	// 		showMore={showMorePositions}
	// 		componentId={'team_position'}
	// 		on:selection_updated={handle_position_selection}

	let positions = [
		{ id: '1', content: '1', value: '1' },
		{ id: '2', content: '2', value: '2' },
		{ id: '3', content: '3', value: '3' }
	];
	let showMorePositions = 'hidden';
	let inicialPosition = 0;

	function handle_position_selection(){
		console.log(team_position);
	}

</script>

<section class="pt-2">
	<MenuBar
		on:keydown={(e) => {
			showModal = e.key == 'Enter' ? true : false;
		}}
		on:click={() => {
			showModal = true;
		}}
	/>

	<!-- <img on:click={() => {requestPermissions(); goto('/qrCodeScanner')}} src="{qrReader}" alt="QR Code Reader Button" class="absolute z-10 w-10 top-3 right-4 fill-red-600"> -->

	<svg role="button" tabindex="0" class="absolute z-10 w-10 top-3 right-4 fill-black dark:fill-white" on:keydown={(e) => {goto('/qrCodeScanner')}} on:click={() => {goto('/qrCodeScanner')}}  width="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M16.1666667,6 C16.0746192,6 16,6.07461921 16,6.16666667 L16,7.83333333 C16,7.92538079 16.0746192,8 16.1666667,8 L17.8333333,8 C17.9253808,8 18,7.92538079 18,7.83333333 L18,6.16666667 C18,6.07461921 17.9253808,6 17.8333333,6 L16.1666667,6 Z M16,18 L16,17.5 C16,17.2238576 16.2238576,17 16.5,17 C16.7761424,17 17,17.2238576 17,17.5 L17,18 L18,18 L18,17.5 C18,17.2238576 18.2238576,17 18.5,17 C18.7761424,17 19,17.2238576 19,17.5 L19,18.5 C19,18.7761424 18.7761424,19 18.5,19 L14.5,19 C14.2238576,19 14,18.7761424 14,18.5 L14,17.5 C14,17.2238576 14.2238576,17 14.5,17 C14.7761424,17 15,17.2238576 15,17.5 L15,18 L16,18 L16,18 Z M13,11 L13.5,11 C13.7761424,11 14,11.2238576 14,11.5 C14,11.7761424 13.7761424,12 13.5,12 L11.5,12 C11.2238576,12 11,11.7761424 11,11.5 C11,11.2238576 11.2238576,11 11.5,11 L12,11 L12,10 L10.5,10 C10.2238576,10 10,9.77614237 10,9.5 C10,9.22385763 10.2238576,9 10.5,9 L13.5,9 C13.7761424,9 14,9.22385763 14,9.5 C14,9.77614237 13.7761424,10 13.5,10 L13,10 L13,11 Z M18,12 L17.5,12 C17.2238576,12 17,11.7761424 17,11.5 C17,11.2238576 17.2238576,11 17.5,11 L18,11 L18,10.5 C18,10.2238576 18.2238576,10 18.5,10 C18.7761424,10 19,10.2238576 19,10.5 L19,12.5 C19,12.7761424 18.7761424,13 18.5,13 C18.2238576,13 18,12.7761424 18,12.5 L18,12 Z M13,14 L12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L13.5,13 C13.7761424,13 14,13.2238576 14,13.5 L14,15.5 C14,15.7761424 13.7761424,16 13.5,16 L10.5,16 C10.2238576,16 10,15.7761424 10,15.5 C10,15.2238576 10.2238576,15 10.5,15 L13,15 L13,14 L13,14 Z M16.1666667,5 L17.8333333,5 C18.4776655,5 19,5.52233446 19,6.16666667 L19,7.83333333 C19,8.47766554 18.4776655,9 17.8333333,9 L16.1666667,9 C15.5223345,9 15,8.47766554 15,7.83333333 L15,6.16666667 C15,5.52233446 15.5223345,5 16.1666667,5 Z M6.16666667,5 L7.83333333,5 C8.47766554,5 9,5.52233446 9,6.16666667 L9,7.83333333 C9,8.47766554 8.47766554,9 7.83333333,9 L6.16666667,9 C5.52233446,9 5,8.47766554 5,7.83333333 L5,6.16666667 C5,5.52233446 5.52233446,5 6.16666667,5 Z M6.16666667,6 C6.07461921,6 6,6.07461921 6,6.16666667 L6,7.83333333 C6,7.92538079 6.07461921,8 6.16666667,8 L7.83333333,8 C7.92538079,8 8,7.92538079 8,7.83333333 L8,6.16666667 C8,6.07461921 7.92538079,6 7.83333333,6 L6.16666667,6 Z M6.16666667,15 L7.83333333,15 C8.47766554,15 9,15.5223345 9,16.1666667 L9,17.8333333 C9,18.4776655 8.47766554,19 7.83333333,19 L6.16666667,19 C5.52233446,19 5,18.4776655 5,17.8333333 L5,16.1666667 C5,15.5223345 5.52233446,15 6.16666667,15 Z M6.16666667,16 C6.07461921,16 6,16.0746192 6,16.1666667 L6,17.8333333 C6,17.9253808 6.07461921,18 6.16666667,18 L7.83333333,18 C7.92538079,18 8,17.9253808 8,17.8333333 L8,16.1666667 C8,16.0746192 7.92538079,16 7.83333333,16 L6.16666667,16 Z M13,6 L10.5,6 C10.2238576,6 10,5.77614237 10,5.5 C10,5.22385763 10.2238576,5 10.5,5 L13.5,5 C13.7761424,5 14,5.22385763 14,5.5 L14,7.5 C14,7.77614237 13.7761424,8 13.5,8 C13.2238576,8 13,7.77614237 13,7.5 L13,6 Z M10.5,8 C10.2238576,8 10,7.77614237 10,7.5 C10,7.22385763 10.2238576,7 10.5,7 L11.5,7 C11.7761424,7 12,7.22385763 12,7.5 C12,7.77614237 11.7761424,8 11.5,8 L10.5,8 Z M5.5,14 C5.22385763,14 5,13.7761424 5,13.5 C5,13.2238576 5.22385763,13 5.5,13 L7.5,13 C7.77614237,13 8,13.2238576 8,13.5 C8,13.7761424 7.77614237,14 7.5,14 L5.5,14 Z M9.5,14 C9.22385763,14 9,13.7761424 9,13.5 C9,13.2238576 9.22385763,13 9.5,13 L10.5,13 C10.7761424,13 11,13.2238576 11,13.5 C11,13.7761424 10.7761424,14 10.5,14 L9.5,14 Z M11,18 L11,18.5 C11,18.7761424 10.7761424,19 10.5,19 C10.2238576,19 10,18.7761424 10,18.5 L10,17.5 C10,17.2238576 10.2238576,17 10.5,17 L12.5,17 C12.7761424,17 13,17.2238576 13,17.5 C13,17.7761424 12.7761424,18 12.5,18 L11,18 Z M9,11 L9.5,11 C9.77614237,11 10,11.2238576 10,11.5 C10,11.7761424 9.77614237,12 9.5,12 L8.5,12 C8.22385763,12 8,11.7761424 8,11.5 L8,11 L7.5,11 C7.22385763,11 7,10.7761424 7,10.5 C7,10.2238576 7.22385763,10 7.5,10 L8.5,10 C8.77614237,10 9,10.2238576 9,10.5 L9,11 Z M5,10.5 C5,10.2238576 5.22385763,10 5.5,10 C5.77614237,10 6,10.2238576 6,10.5 L6,11.5 C6,11.7761424 5.77614237,12 5.5,12 C5.22385763,12 5,11.7761424 5,11.5 L5,10.5 Z M15,10.5 C15,10.2238576 15.2238576,10 15.5,10 C15.7761424,10 16,10.2238576 16,10.5 L16,12.5 C16,12.7761424 15.7761424,13 15.5,13 C15.2238576,13 15,12.7761424 15,12.5 L15,10.5 Z M17,15 L17,14.5 C17,14.2238576 17.2238576,14 17.5,14 L18.5,14 C18.7761424,14 19,14.2238576 19,14.5 C19,14.7761424 18.7761424,15 18.5,15 L18,15 L18,15.5 C18,15.7761424 17.7761424,16 17.5,16 L15.5,16 C15.2238576,16 15,15.7761424 15,15.5 L15,14.5 C15,14.2238576 15.2238576,14 15.5,14 C15.7761424,14 16,14.2238576 16,14.5 L16,15 L17,15 Z M3,6.5 C3,6.77614237 2.77614237,7 2.5,7 C2.22385763,7 2,6.77614237 2,6.5 L2,4.5 C2,3.11928813 3.11928813,2 4.5,2 L6.5,2 C6.77614237,2 7,2.22385763 7,2.5 C7,2.77614237 6.77614237,3 6.5,3 L4.5,3 C3.67157288,3 3,3.67157288 3,4.5 L3,6.5 Z M17.5,3 C17.2238576,3 17,2.77614237 17,2.5 C17,2.22385763 17.2238576,2 17.5,2 L19.5,2 C20.8807119,2 22,3.11928813 22,4.5 L22,6.5 C22,6.77614237 21.7761424,7 21.5,7 C21.2238576,7 21,6.77614237 21,6.5 L21,4.5 C21,3.67157288 20.3284271,3 19.5,3 L17.5,3 Z M6.5,21 C6.77614237,21 7,21.2238576 7,21.5 C7,21.7761424 6.77614237,22 6.5,22 L4.5,22 C3.11928813,22 2,20.8807119 2,19.5 L2,17.5 C2,17.2238576 2.22385763,17 2.5,17 C2.77614237,17 3,17.2238576 3,17.5 L3,19.5 C3,20.3284271 3.67157288,21 4.5,21 L6.5,21 Z M21,17.5 C21,17.2238576 21.2238576,17 21.5,17 C21.7761424,17 22,17.2238576 22,17.5 L22,19.5 C22,20.8807119 20.8807119,22 19.5,22 L17.5,22 C17.2238576,22 17,21.7761424 17,21.5 C17,21.2238576 17.2238576,21 17.5,21 L19.5,21 C20.3284271,21 21,20.3284271 21,19.5 L21,17.5 Z"/>
	  </svg>
	<header>
		
<svg xmlns="http://www.w3.org/2000/svg" class="stroke-1 stroke-primary-heavy fill-[#666666] dark:stroke-none dark:fill-white scale-[1.2]" stroke="black" stroke-width="1" xmlns:xlink="http://www.w3.org/1999/xlink" width="80vw" zoomAndPan="magnify" viewBox="0 0 224.87999 74.999997" height="90" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><g/></defs><g class="fill-primary-base dark:fill-primary-base" fill-opacity="1"><g transform="translate(-0.657527, 48.081926)"><g><path d="M 17.34375 -5.1875 L 10.296875 -14.234375 L 7.15625 0 L 1.15625 0 L 7.15625 -26.796875 L 17.34375 -13.625 L 27.515625 -26.796875 L 33.515625 0 L 27.515625 0 L 24.375 -14.234375 Z M 17.34375 -5.1875 "/></g></g></g><g fill-opacity="1"><g transform="translate(52.39695, 48.175506)"><g/></g><g transform="translate(57.186879, 48.175506)"><g/></g><g transform="translate(61.976808, 48.175506)"><g/></g><g transform="translate(66.766737, 48.175506)"><g/></g><g transform="translate(71.556666, 48.175506)"><g/></g><g transform="translate(76.346595, 48.175506)"><g/></g><g transform="translate(81.136525, 48.175506)"><g/></g><g transform="translate(85.926454, 48.175506)"><g/></g><g transform="translate(90.716383, 48.175506)"><g/></g><g transform="translate(95.506312, 48.175506)"><g/></g><g transform="translate(100.296241, 48.175506)"><g/></g><g transform="translate(105.08617, 48.175506)"><g/></g><g transform="translate(109.8761, 48.175506)"><g/></g><g transform="translate(114.666029, 48.175506)"><g/></g></g><g fill-opacity="1"><g transform="translate(119.455958, 48.175506)"><g><path d="M 2.4375 -14.859375 L 16 -14.859375 L 16 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 16 -2.921875 L 16 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g><g transform="translate(136.115331, 48.175506)"><g><path d="M 14.234375 -14.859375 C 14.710938 -14.859375 15.125 -14.679688 15.46875 -14.328125 C 15.820312 -13.984375 16 -13.570312 16 -13.09375 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.957031 0 1.539062 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.539062 -14.679688 1.957031 -14.859375 2.4375 -14.859375 Z M 12.515625 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 12.515625 -2.921875 Z M 12.515625 -11.9375 "/></g></g><g transform="translate(152.784285, 48.175506)"><g><path d="M 12.5 -14.859375 L 16 -14.859375 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 -2.921875 L 12.5 -2.921875 Z M 12.5 -14.859375 "/></g></g><g transform="translate(169.443658, 48.175506)"><g><path d="M 16 -14.859375 L 16 -11.9375 L 10.078125 -11.9375 L 10.078125 0 L 6.578125 0 L 6.578125 -11.9375 L 0.671875 -11.9375 L 0.671875 -14.859375 Z M 16 -14.859375 "/></g></g><g transform="translate(186.103031, 48.175506)"><g><path d="M 0.671875 0 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 0 Z M 0.671875 0 "/></g></g><g transform="translate(190.93128, 48.175506)"><g><path d="M 4.15625 -8.515625 L 4.15625 0 L 0.671875 0 L 0.671875 -15.578125 L 12.5 -6.34375 L 12.5 -14.859375 L 16 -14.859375 L 16 0.71875 Z M 4.15625 -8.515625 "/></g></g><g transform="translate(207.590653, 48.175506)"><g><path d="M 2.4375 -14.859375 L 15.125 -14.859375 L 15.125 -11.9375 L 4.15625 -11.9375 L 4.15625 -2.921875 L 12.5 -2.921875 L 12.5 -5.96875 L 9 -5.96875 L 9 -8.890625 L 16 -8.890625 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g></g><g class="fill-primary-base dark:fill-primary-base" fill-opacity="1"><g transform="translate(34.668262, 48.175506)"><g><path d="M 2.4375 -14.859375 L 14.234375 -14.859375 C 14.710938 -14.859375 15.125 -14.679688 15.46875 -14.328125 C 15.820312 -13.984375 16 -13.570312 16 -13.09375 L 16 0 L 12.5 0 L 12.5 -4.515625 L 4.171875 -4.515625 L 4.171875 0 L 0.671875 0 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 12.5 -7.421875 L 12.5 -11.9375 L 4.171875 -11.9375 L 4.171875 -7.421875 Z M 12.5 -7.421875 "/></g></g><g transform="translate(51.337215, 48.175506)"><g><path d="M 2.4375 -14.859375 L 15.125 -14.859375 L 15.125 -11.9375 L 4.15625 -11.9375 L 4.15625 -2.921875 L 12.5 -2.921875 L 12.5 -5.96875 L 9 -5.96875 L 9 -8.890625 L 16 -8.890625 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g><g transform="translate(67.996589, 48.175506)"><g><path d="M 0.671875 0 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 0 Z M 0.671875 0 "/></g></g><g transform="translate(72.824837, 48.175506)"><g><path d="M 2.4375 -14.859375 L 16 -14.859375 L 16 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 16 -2.921875 L 16 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g></g><g fill-opacity="1"><g transform="translate(91.210323, 48.081926)"><g><path d="M 4.203125 -25.546875 L 26.015625 -25.546875 L 26.015625 -20.515625 L 7.171875 -20.515625 L 7.171875 -15.296875 L 24.484375 -15.296875 C 25.304688 -15.296875 26.015625 -14.992188 26.609375 -14.390625 C 27.210938 -13.785156 27.515625 -13.070312 27.515625 -12.25 L 27.515625 -3.03125 C 27.515625 -2.195312 27.210938 -1.484375 26.609375 -0.890625 C 26.015625 -0.296875 25.304688 0 24.484375 0 L 1.15625 0 L 1.15625 -5.03125 L 21.5 -5.03125 L 21.5 -10.265625 L 4.203125 -10.265625 C 3.367188 -10.265625 2.648438 -10.5625 2.046875 -11.15625 C 1.453125 -11.75 1.15625 -12.460938 1.15625 -13.296875 L 1.15625 -22.515625 C 1.15625 -23.335938 1.453125 -24.046875 2.046875 -24.640625 C 2.648438 -25.242188 3.367188 -25.546875 4.203125 -25.546875 Z M 4.203125 -25.546875 "/></g></g></g></svg>
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

		<div class="">
			<label for="team_number" class="home-label in">{$_('home_page.team_number')}</label>
			<input bind:value={team_number} name="team_number" type="number" class="home-inp {((validationError) && (team_number == '')) ? 'validation-error' : ''}" placeholder="5800" />
			<span class="validation-error-message {((validationError) && (team_number == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<div class="">
			<label for="match_number" class="home-label">{$_('home_page.match_number')}</label>
			<input bind:value={match_number} name="match_number" type="number" class="home-inp {((validationError) && (match_number == '')) ? 'validation-error' : ''}" placeholder="32" />
			<span class="validation-error-message {((validationError) && (match_number == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<div class="">
			<label for="team_position" class="home-label">{$_('home_page.team_position')}</label>
			<!-- <input bind:value={team_position} name="team_position" type="number" class="home-inp {((validationError) && (team_position == '')) ? 'validation-error' : ''}" placeholder="1, 2 ou 3" /> -->
			<SelectInput
			options={positions}
			inicialOption={inicialPosition}
			bind:SelectedOption={team_position}
			showMore={showMorePositions}
			componentId={'team_position'}
			on:selection_updated={handle_position_selection}
			/>
			<span class="validation-error-message {((validationError) && (team_position == '')) ? 'visible' : 'invisible'}">{$_('home_page.validation_error_message')}</span>
		</div>
		<button class="w-full submit_team_info btn mt-0 {(!isDataBaseSet || isDataBaseSet =='setting') ? 'bg-gray-600 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-600' : ''}" type="submit" disabled={!isDataBaseSet || isDataBaseSet == 'setting'}> {$_('home_page.continue_button')} </button>
	</form>

	<div class="separator"></div>

	<div class="w-4/5">
		<button type="button" on:click={() => {goto('/qrcodeStorage')}} class="mb-0 btn">
				{$_('home_page.storage_button')}
		</button>
		<!-- <label class="text-sm font-black home-label dark:text-neutral-400">Há # Qr Codes não escaneados</label> -->
	</div>
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

<h4 class="fixed italic font-semibold text-gray-500 bottom-3 right-4">MagicScouting v2.0</h4>

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
	.validation-error {
   		@apply outline empty:outline-redTheme-600;
	}
	.validation-error-message {
   		@apply text-red-300 font-medium ml-2;
	}

</style>
