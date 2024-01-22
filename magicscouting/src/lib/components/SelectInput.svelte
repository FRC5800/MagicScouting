<script>
	import { createEventDispatcher } from 'svelte';

	export let options = [
		{ id: '1', content: 'undefined', value: 'not specified' },
		{ id: '2', content: 'undefined', value: 'not specified' }
	];

	// @ts-ignore
	export let inicialOption = '';
	// @ts-ignore
	/**
	 * @type {{ content: any; id?: string; value?: string; }}
	 */
	 export let opcaoSelecionada = options[0];
	if(inicialOption != '') {
		console.log(inicialOption)
		// @ts-ignore
		options.forEach((option) => {if (option['value'] == inicialOption) opcaoSelecionada = option })
	}

	export let showMore = 'hidden';

	export let componentId = 'undefined';

	export const dispatch = createEventDispatcher();
</script>

<div class="w-full text-[#474747] dark:text-white">
	<div class="max-w-md mx-auto">
		<div class="relative overflow-visible">
			<div
				class="flex items-center h-10 bg-[#EAEAEC] dark:bg-grey-heavy pl-3 font-normal border-[#BEBEC5] dark:border-0 border-[1.5px] rounded z-20"
			>
				<label
					for="show_more-{componentId}"
					class="flex flex-row items-center justify-between w-full text-[#3A3A41] dark:text-white align-middle transition-all border-l border-gray-200 dark:border-grey-heavy outline-none cursor-pointer focus:outline-none hover:text-[#474747]"
				>
					{opcaoSelecionada.content}
					<svg
						class="content-end w-4 h-4 mx-2 fill-current"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="18 15 12 9 6 15"></polyline>
					</svg>
				</label>
			</div>

			<input
				on:input={() => {
					showMore = showMore == 'hidden' ? 'flex' : 'hidden';
				}}
				type="checkbox"
				name="show_more"
				id="show_more-{componentId}"
				class="hidden peer"
			/>
			<div
				id="dropdown-menu-{componentId}"
				tabindex="0"
				role="button"
				on:keydown={(e) => {
					if (e.key == ' ') {
						showMore = showMore == 'hidden' ? 'flex' : 'hidden';
					}
					console.log(e.key);
				}}
				on:click={() => {
					showMore = showMore == 'hidden' ? 'flex' : 'hidden';
					dispatch('selection_updated');
				}}
				class="absolute flex-col {showMore} w-full max-h-[10rem] mt-1 overflow-auto box-border
           bg-[#EAEAEC] dark:bg-grey-heavy border dark:border-grey-heavy border-gray-200 dark:text-white rounded shadow peer-checked:force z-30"
			>
				{#each options as lingua (lingua.id)}
					<div
						tabindex="0"
						role="button"
						on:keydown={(e) => {
							if (e.key == ' ') opcaoSelecionada = lingua;
						}}
						on:click={(e) => {
							opcaoSelecionada = lingua;
						}}
						class="box-border p-2 cursor-pointer group border-l-[3px] {opcaoSelecionada == lingua ? 'border-blue-600 dark:border-blue-600' : ''} dark:hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:border-blue-600 focus:bg-blue-600 focus:text-white dark:border-grey-heavy"
					>
						<a href={null} class="block text-[#666666] dark:text-white box-border font-normal border-transparent hover:no-underline"
							>{lingua.content}
						</a>
					</div>
				{/each}
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div id="overlay" 
			on:click={() => {showMore = showMore == 'hidden' ? 'flex' : 'hidden'}} class="{showMore} w-[100vw] h-[100vh] fixed bg-transparent z-10 top-0 left-0"></div>
		</div>
	</div>
</div>
