<script>
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { goto } from '$app/navigation';
    import { _ } from "svelte-i18n";

</script>

<main class="w-full bg-[#EAEAEC] dark:bg-[#060024] p-2 dark:text-white">
    <header class="flex flex-row w-full p-2 text-3xl font-bold border-b-2 items-centers mb-9">
        <i class="p-0 pl-2 pr-8 mr-16 border-r-2 fa-solid fa-angle-left" on:click={() => {goto('/')}}></i>
        <h1>{$_('storage.title')}</h1>
    </header>
    <slot />
</main>
