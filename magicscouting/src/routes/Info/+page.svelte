<script>
    import "../../app.css";
    import InfoSelect from "./infoSelect.svelte";
    import SelectInput from "$lib/components/SelectInput.svelte";
    import { goto } from '$app/navigation';

    /** @type {import('./$types').PageData} */

    $: ataque = {
        name : "atk",
        options: [{id: 0, value: false}, {id: 1, value: true}],
        content: ['Não', 'Sim'],
        selected:'undefined'
    }
    function handleAttack(e) {
        console.log(e)
    }
    $: handleAttack(ataque.selected)

    $: defesa = {
        name : "def",
        options: [{ id: 0, value: false}, { id: 1, value: true}],
        content: ['Não', 'Sim'],
        selected:'undefined'
    }

    $: suporte = {
        name : "sup",
        options: [{ id: 0, value: false}, { id: 1, value: true}],
        content: ['Não', 'Sim'],
        selected:'undefined'
    }
    // function storeData(payload) {
	// 	for (var key in payload) {
	// 		localStorage.setItem(key, payload[key]);
	// 	}
	// }

    function onSubmit(){
        // let payload = JSON.stringify([(ataque.selected ? "Attack" : ""), (defesa.selected ? "Defense" : ""), (suporte.selected ? "Support" : "")].filter((x) => {return x!=""})).replaceAll("[", "").replaceAll("]", "").replaceAll("\"", ""); 
        // console.log(payload);
        // storeData({"matchFunction": payload});
        goto("/qrcode")
    }



</script>

<h2 class="pt-4 pb-2 mt-4">Jogou no Ataque</h2>
<InfoSelect instance_options={ataque} bind:selectedOption={ataque.selected} width={'20vw'} />
<h2 class="pt-4 pb-2 mt-4">Jogou no Defesa</h2>
<InfoSelect instance_options={defesa} bind:selectedOption={defesa.selected} width={'20vw'} />
<h2 class="pt-4 pb-2 mt-4">Jogou de Suporte</h2>
<InfoSelect instance_options={suporte} bind:selectedOption={suporte.selected} width={'20vw'} />

<button on:click={onSubmit} class="w-6/12 mt-16 btn">Continuar</button>

<style lang="postcss">
    h2{
        @apply font-black;
    }
</style>
