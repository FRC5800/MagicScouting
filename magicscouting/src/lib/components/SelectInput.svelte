<script>
  import {createEventDispatcher} from 'svelte';

    export let options = [
        {id: '1', content: 'undefined', value: 'not specified'},
        {id: '2', content: 'undefined', value: 'not specified'}
    ]

    export let opcaoSelecionada = 'Selecione um tema';
    export let showMore = 'hidden';

    export let componentId = 'undefined';

    export const dispatch = createEventDispatcher();

</script>

<div class="w-full text-[#474747] ">
    <div class="max-w-md mx-auto">
  
      <div class="relative overflow-visible">
        <div class="flex items-center h-10 bg-[#EAEAEC] dark:bg-white pl-3 font-normal border-[#BEBEC5] border-[1.5px] rounded">

          <label for="show_more-{componentId}" class="flex flex-row items-center justify-between w-full text-[#3A3A41] align-middle transition-all border-l border-gray-200 outline-none cursor-pointer focus:outline-none hover:text-[#474747]">
            {opcaoSelecionada.charAt(0).toUpperCase() + opcaoSelecionada.slice(1)}
            <svg class="content-end w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </label>
        </div>
  
        <input on:input={() => {showMore = (showMore == 'hidden') ? 'flex' : 'hidden'}} type="checkbox" name="show_more" id="show_more-{componentId}" class="hidden peer" />
        <div id="dropdown-menu-{componentId}" tabindex="0" role="button" on:keydown={(e) => {if (e.key == ' ') {showMore = (showMore == 'hidden') ? 'flex' : 'hidden'}; console.log(e.key)}} on:click={() => {showMore = (showMore == 'hidden') ? 'flex' : 'hidden'; dispatch("selection_updated")}} class="absolute flex-col {showMore} w-full max-h-[10rem] mt-1 overflow-auto box-border
           bg-white border border-gray-200 rounded shadow peer-checked:force">
          {#each options as lingua (lingua.id)}
          <div tabindex="0" role="button" on:keydown={(e) => {if (e.key == ' ') opcaoSelecionada = lingua.value}} on:click={(e) => {opcaoSelecionada = lingua.value}}  class="box-border p-2 cursor-pointer group border-l-[3px] group-hover:border-blue-600 group-hover:bg-blue-600  hover:text-white focus:border-blue-600 focus:bg-blue-600  focus:text-white">
            <a href="{null}" class="block text-[#666666] box-border font-normal border-transparent ">{lingua.content}
            </a>
          </div>
          {/each}
        </div>
      </div>
    </div>
  </div>  