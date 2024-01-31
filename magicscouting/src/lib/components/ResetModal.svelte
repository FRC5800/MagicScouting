<script>
// @ts-nocheck

    import { _ } from "svelte-i18n";
    import { goto } from '$app/navigation';
    import Modal from '$lib/components/Modal.svelte';
	export let resetConfirmation;

	$: console.log(resetConfirmation);
	
    let keys = ["team","match","arenaPos","red/blue","autoAmpScore","autoAmpMiss","autoSpeakerScore","autoSpeakerMiss","isLeave","teleopAmpScore","teleopAmpMiss","teleopSpeakerScore","teleopSpeakerMiss","speakerAmplifiedScore","trapStatus","onStageStatus","onStageTime","sourceCycleTime","floorCycleTime","highNoteStatus","matchFunction"]; 

</script>
<Modal bind:showModal={resetConfirmation} showX={false}>
	<h2 class="text-2xl mb-2">{$_('qrcode.confirmation_modal.title')}</h2>
	<div class="flex flex-row justify-between box-border w-full border">
		<button on:click={() => {keys.forEach((key) => {localStorage.setItem(key, null)}); goto("/")}} class="w-[45%] p-2 shadow-md shadow-black bg-white active:shadow-inner text-black rounded-md">{$_('qrcode.confirmation_modal.yes_button')}</button>
		<button on:click={() => {resetConfirmation = false}} class="w-[45%] p-2 shadow-md shadow-black bg-white text-black rounded-md active:shadow-inner">{$_('qrcode.confirmation_modal.no_button')}</button>
	</div>
</Modal>