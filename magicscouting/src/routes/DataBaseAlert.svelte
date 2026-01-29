<script>
// @ts-nocheck
    import { goto } from '$app/navigation';
import { _ } from 'svelte-i18n';


    /**
     * @typedef {Object} Props
     * @property {boolean} [isDataBaseSet]
     * @property {boolean} [showModal]
     * @property {boolean} [showDataBaseSelector]
     */

    /** @type {Props} */
    let { isDataBaseSet = $bindable(false), showModal = $bindable(false), showDataBaseSelector = false } = $props();
</script>

<h1 class="text-2xl">{$_('home_page.database_alert.title')}</h1>
<div class="separator w-[50%] m-0 mb-4"></div>
<div class="w-[50vw] flex flex-col items-center">
    <p class="text-base font-bold text-justify text-gray-600 dark:text-gray-400">{$_('home_page.database_alert.message')}</p>
    <a href="https://github.com/FRC5800/MagicScouting" class="m-4 underline text-primary-base">{$_('home_page.database_alert.repository')}</a>
</div>
<button onclick={() => {showModal = false; goto("/settings"); isDataBaseSet = 'setting'}} class="mb-10 min-w-fit p-2 rounded-lg w-full btn mt-4 btn-primary hover:bg-primary-base bg-buttons border-buttons">{$_('home_page.database_alert.menu_button')}</button>