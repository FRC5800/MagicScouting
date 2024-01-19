<script>
    import "../../../app.css";
    import InfoSelect from "../infoSelect.svelte";
    import { goto } from '$app/navigation';

    /** @type {import('./$types').PageData} */
    export let data;

    $: faltas = {
        options: [{ id: 0, value: 'foul_nenhuma'}, { id: 1, value: 'foul_poucas'}, { id: 2, value: 'foul_muitas'}],
        content: ['Nenhuma', 'Poucas', 'Muitas'],
        selected:'undefined'
    }

    $: recarga = {
        options: [{ id: 0, value: 'chao'}, { id: 1, value: 'source'}],
        content: ['Chão', 'Source'],
        selected:'undefined'
    }

    $: quebrou = {
        options: [{ id: 0, value: 'breaked_nao'}, { id: 1, value: 'breaked_sim'}],
        content: ['Não', 'Sim'],
        selected:'undefined'
    }
</script>

<h2 class="pt-4 pb-2">Faltas realizadas</h2>
<InfoSelect options={faltas.options} content={faltas.content} selectedOption={faltas.selected} width={'20vw'} />
<div class="flex flex-row justify-between w-[80vw] mb-[5vh]">
    <div class="flex flex-col items-center">
        <h2 class="pt-4 pb-2">Robô teve Defeito?</h2>
        <InfoSelect options={quebrou.options} content={quebrou.content} selectedOption={quebrou.selected} width={'18vw'} />
    </div>
    <div class="flex flex-col items-center">
        <h2 class="pt-4 pb-2">Abastecimento</h2>
        <InfoSelect options={recarga.options} content={recarga.content} selectedOption={recarga.selected} width={'18vw'} />
    </div>
</div>

<textarea name="comentario" id="comentario" class="text-[white] rounded-lg bg-grey-heavy p-2 box-border resize-none w-[100%] h-[25vh]" placeholder="Digite seu comentário..."></textarea>

<button on:click={() => {goto('/Info')}} class="w-6/12 mt-4 btn">Continuar</button>