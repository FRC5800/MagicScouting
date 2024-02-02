<script>
// @ts-nocheck

    import "../../app.css";
    
    import { _ } from 'svelte-i18n';
	import { App } from '@capacitor/app';
    import { goto } from '$app/navigation';
    
    import storeData from "$lib/shared/scripts/controlData.js";
    import InfoSelect from "./infoSelect.svelte";
    import ResetModal from '$lib/components/ResetModal.svelte';

    let ataque = {
        name : "atk",
        options: [{id: 0, value: false}, {id: 1, value: true}],
        content: [$_('info.no'), $_('info.yes')],
        selected: false
    }

    let defesa = {
        name : "def",
        options: [{ id: 0, value: false}, { id: 1, value: true}],
        content: [$_('info.no'), $_('info.yes')],
        selected: false
    }

    let suporte = {
        name : "sup",
        options: [{ id: 0, value: false}, { id: 1, value: true}],
        content: [$_('info.no'), $_('info.yes')],
        selected: false
    }

    function onSubmit(){
        let payload = JSON.stringify([(ataque.selected ? "Attack" : ""), (defesa.selected ? "Defense" : ""), (suporte.selected ? "Support" : "")].filter((x) => {return x!=""})).replaceAll("[", "").replaceAll("]", "").replaceAll("\"", ""); 
        console.log(payload);
        storeData({"matchFunction": payload});
        goto("/qrcode")
    }

    let resetConfirmation = false;
	App.addListener("backButton", ()=>{resetConfirmation = true;});

</script>

<ResetModal bind:resetConfirmation={resetConfirmation}/>

<h2 class="pt-4 pb-2 mt-4">{$_('info.attack_title')}</h2>
<InfoSelect instance_options={ataque} bind:selectedOption={ataque.selected} width={'20vw'} />
<h2 class="pt-4 pb-2 mt-4">{$_('info.defense_title')}</h2>
<InfoSelect instance_options={defesa} bind:selectedOption={defesa.selected} width={'20vw'} />
<h2 class="pt-4 pb-2 mt-4">{$_('info.support_title')}</h2>
<InfoSelect instance_options={suporte} bind:selectedOption={suporte.selected} width={'20vw'} />

<button on:click={onSubmit} class="mt-16 btn">{$_('info.continue_button')}</button>

<style lang="postcss">
    h2{
        @apply font-black;
    }
</style>
