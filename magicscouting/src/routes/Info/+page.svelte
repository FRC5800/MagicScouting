<script>
    import "../../app.css";
    import InfoSelect from "./infoSelect.svelte";
    import SelectInput from "$lib/components/SelectInput.svelte";
    import { goto } from '$app/navigation';

    /** @type {import('./$types').PageData} */
    export let data;

    $: velocidade = {
        options: [{id: 0, value: 'vel_lenta'}, {id: 1, value: 'vel_mediana'}, {id: 2, value: 'vel_rapida'}],
        content: ['Lenta', 'Mediana', 'Rápida'],
        selected:'undefined'
    }

    $: defesa_feita = {
        options: [{ id: 0, value: 'def_ruim'}, { id: 1, value: 'def_mediana'}, {id: 2, value: 'def_boa'}],
        content: ['Ruim', 'Mediana', 'Boa'],
        selected:'undefined'
    }

    $: defesa_sofrida = {
        options: [{ id: 0, value: 'pin_pouca'}, { id: 1, value: 'pin_mediana'}, { id: 2, value: 'pin_muita'}],
        content: ['Pouca', 'Mediana', 'Muita'],
        selected:'undefined'
    }

    let funcaoEmJogo = [
        {id: '1', content: 'Atacante', value: 'atk'},
        {id: '2', content: 'Suporte', value: 'sup'},
        {id: '3', content: 'Defesa', value: 'def'}
    ]
    let showMoreFuncoes = 'hidden';
</script>

<h2 class="pt-4 pb-2">Função na partida</h2>
<div class="w-1/2">
    <SelectInput options={funcaoEmJogo} opcaoSelecionada={funcaoEmJogo[0]} showMore={showMoreFuncoes} componentId={'funcoes'} />
</div>

<h2 class="pt-4 pb-2">Velocidade do Robô</h2>
<InfoSelect options={velocidade.options} content={velocidade.content} selectedOption={velocidade.selected} width={'20vw'} />
<h2 class="pt-4 pb-2">Defesa realizada</h2>
<InfoSelect options={defesa_feita.options} content={defesa_feita.content} selectedOption={defesa_feita.selected} width={'20vw'} />
<h2 class="pt-4 pb-2">Defesa sofrida</h2>
<InfoSelect options={defesa_sofrida.options} content={defesa_sofrida.content} selectedOption={defesa_sofrida.selected} width={'20vw'} />

<button on:click={() => {goto('Info/extraInfo')}} class="w-6/12 mt-4 btn">Continuar</button>