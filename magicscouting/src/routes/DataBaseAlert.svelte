<script>
// @ts-nocheck
    import { _ } from 'svelte-i18n';


    export let isDataBaseSet = false;
    export let showModal = false;
    export let showDataBaseSelector = false;
</script>

<h1 class="text-2xl">{$_('home_page.database_alert.title')}</h1>
    <div class="separator w-[50%] m-0 mb-4"></div>
    <div class="w-[50vw] flex flex-col items-center">
        <p class="text-base font-bold text-justify text-gray-600 dark:text-gray-400">{$_('home_page.database_alert.message')}</p>
        <a href="https://github.com/FRC5800/MagicScouting" class="m-4 underline text-primary-base">{$_('home_page.database_alert.repository')}</a>
    </div>
    <button on:click={() => {showModal = true; showDataBaseSelector = true; isDataBaseSet = 'setting'}} class="mb-10 min-w-fit mt-4 bg-buttons p-2 rounded-lg w-[80%] btn">{$_('home_page.database_alert.menu_button')}</button>