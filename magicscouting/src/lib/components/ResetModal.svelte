<script>
	import { run } from 'svelte/legacy';

// @ts-nocheck

    import { _ } from "svelte-i18n";
    import { goto } from '$app/navigation';
    
	import Modal from '$lib/components/Modal.svelte';
	
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [resetConfirmation]
	 * @property {string} [redirectUrl]
	 * @property {any} [confirmModal]
	 * @property {any} [cancelModal]
	 */

	/** @type {Props} */
	let {
		resetConfirmation = $bindable(true),
		redirectUrl = "/",
		confirmModal = ()=>{},
		cancelModal = ()=>{}
	} = $props();

	run(() => {
		console.log(resetConfirmation);
	});
	
    let keys = ["team","match","arenaPos","red/blue","autoAmpScore","autoAmpMiss","autoSpeakerScore","autoSpeakerMiss","isLeave","teleopAmpScore","teleopAmpMiss","teleopSpeakerScore","teleopSpeakerMiss","speakerAmplifiedScore","trapStatus","onStageStatus","onStageTime","sourceCycleTime","floorCycleTime","highNoteStatus","matchFunction", "robotBroke", "commFault"]; 

</script>
<Modal bind:showModal={resetConfirmation} showX={false}>
	<h2 class="mb-2 text-2xl">{$_('qrcode.confirmation_modal.title')}</h2>
	<div class="box-border flex flex-row justify-between w-full">
		<button onclick={() => {keys.forEach((key) => {localStorage.setItem(key, null)}); goto(redirectUrl); confirmModal()}} class="w-[45%] p-2 shadow-md shadow-black bg-white active:shadow-inner text-black rounded-md">{$_('qrcode.confirmation_modal.yes_button')}</button>
		<button onclick={() => {resetConfirmation = false; cancelModal()}} class="w-[45%] p-2 shadow-md shadow-black bg-white text-black rounded-md active:shadow-inner">{$_('qrcode.confirmation_modal.no_button')}</button>
	</div>
</Modal>
