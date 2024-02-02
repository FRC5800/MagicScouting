<script>
// @ts-nocheck

    import { _ } from 'svelte-i18n';
    import dataBase from '$lib/shared/stores/dataBase';
    import { useDB }  from '$lib/shared/stores/dataBase';
    import { goto } from '$app/navigation';

    export let showDataBase = false;
    $: team_database = $useDB ? $dataBase : '';

    function handleDataBase() {
        if (team_database.includes("script.google")){
            $dataBase = team_database[team_database.length-1] == "?" ? team_database : team_database + "?";
            showDataBase = false;
        }else{
            alert("Url invalido");
        }        
    }
</script>

{#if !showDataBase}
    <h1 class="text-2xl">{$_('home_page.menu.title')}</h1>
    <div class="separator" style="width: 50%;"></div>

    <div class="flex flex-col items-center sm:px-[5vw] font-defaultText font-bold text-[1.2rem]">
        <div tabindex="0" role="button" on:keydown on:click class="py-2 cursor-pointer option">{$_('home_page.menu.option_config')}</div>
        <hr class="border-[#666666] w-[70%] h-1"/>
        <div tabindex="0" role="button" on:keydown on:click={() => {showDataBase = true}} class="py-2 option">{$_('home_page.menu.option_database')}</div>
        <hr class="border-[#666666] w-[70%] h-1">
        <div on:click={() =>{alert('Documentation in progress')}} class="py-2 option">{$_('home_page.menu.option_guide')}</div>
        <hr class="border-[#666666] w-[70%] h-1">
        <div on:click={() => {goto('/about')} } class="py-2 pb-10 option">{$_('home_page.menu.option_about')}</div>
        
    </div>

    <div class="flex flex-row justify-around w-[100%] text-[1.8rem]">
        <a href="https://www.instagram.com/frc5800/"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://github.com/FRC5800/"><i class="fa-brands fa-github"></i></a>
        <a href="https://www.tiktok.com/@frc.5800"><i class="fa-brands fa-tiktok"></i></a>
        <a href="https://www.youtube.com/@FRC5800"><i class="fa-brands fa-youtube"></i></a>
    </div>
{:else}
    <h1 class="text-2xl">{$_('home_page.database.title')}</h1>
    <div class="separator w-[50%] m-0 mb-4"></div>
    <div class="w-[50vw] flex flex-col items-center">
        <p class="text-base font-bold text-justify text-gray-600 dark:text-gray-400">{$_('home_page.database.message')}</p>
        <a href="https://github.com/FRC5800/MagicScouting" class="m-4 underline text-primary-base">{$_('home_page.database.repository')}</a>
    </div>
    <div class="flex flex-col items-center p-2 my-2 rounded-md min-w-fit useDatabase">
        <h3>{$_('home_page.database.useDB')}</h3>
        <div class="center-container">
			<label class="relative inline-flex cursor-pointer">
				<input
					type="checkbox"
                    checked={JSON.parse($useDB)}
					class="align-middle sr-only peer"
					name="useDB"
                    on:click={(params) => {
                        $useDB = !$useDB
                    }}
				/>
				<div
					class="w-11 h-6 align-middle bg-gray-600 rounded-full peer peer-focus:ring-primary-light dark:peer-focus:ring-primary-base dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-base"
				></div>
            </label>
        </div>
    </div>
    <input disabled={!JSON.parse($useDB)} type="text" bind:value={team_database} placeholder="Database" class="w-full p-2 text-base rounded-md text-neutral-600">
    <button disabled={!JSON.parse($useDB)} on:click={handleDataBase} class="{JSON.parse($useDB) ? '' : 'disabled-btn'} mb-10 mt-4 bg-buttons p-2 rounded-lg w-[80%] btn">{$_('home_page.database.confirm_button')}</button>
{/if}


<style lang="postcss">
    .option:hover{
        text-shadow: 0 0 1rem theme(colors.primary.light);
    }
</style>