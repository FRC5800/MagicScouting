<script>
	// @ts-nocheck
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n'

	export let options = [];
	export let name = "";

	export let value = '';

	export const dispatch = createEventDispatcher();
	export let handler = function(){console.log("Without handler")}
</script>

<select name={name} bind:value={value} on:change={handler} class="select select-bordered w-full text-base">
	<option disabled selected value="">{$_('home_page.settings.option_language')}</option>
	{#if options==[]}
		<slot/>
	{/if}
	{#if options!=[]}
		{#each options as opt}
			<option value={opt.value}>{opt.content}</option>
		{/each}
	{/if}
</select>
<!-- 
<div class="w-full text-[#474747] dark:text-white">
	<div class="max-w-md mx-auto">
		<div class="relative overflow-visible">
			<div
				class="flex items-center h-10 bg-[#EAEAEC] dark:bg-grey-heavy pl-3 font-normal border-[#BEBEC5] dark:border-0 border-[1.5px] rounded z-20"
			>
				<label
					for="show_more-{componentId}"
					class="flex flex-row items-center justify-between w-full text-gray-600 font-semibold dark:text-white align-middle transition-all border-l border-gray-200 dark:border-grey-heavy outline-none cursor-pointer focus:outline-none hover:text-[#474747]"
				>
					{SelectedOption.content || $_('home_page.empty_position')}
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
							if (e.key == ' ') SelectedOption = lingua;
						}}
						on:click={(e) => {
							SelectedOption = lingua;
						}}
						class="box-border p-2 cursor-pointer group border-l-[3px] {SelectedOption == lingua ? 'border-primary-base dark:border-primary-base' : ''} dark:hover:border-primary-base hover:bg-primary-base hover:text-white hover:border-primary-base focus:border-primary-base focus:bg-primary-base focus:text-white dark:border-grey-heavy"
					>
						<a href={null} class="block text-[#666666] hover:text-white dark:text-white box-border border-transparent hover:no-underline font-semibold"
							>{lingua.content}
						</a>
					</div>
				{/each}
			</div>
			<div id="overlay" 
			on:click={() => {showMore = showMore == 'hidden' ? 'flex' : 'hidden'}} class="{showMore} w-[100vw] h-[100vh] fixed bg-transparent z-10 top-0 left-0"></div>
		</div>
	</div>
</div> -->
