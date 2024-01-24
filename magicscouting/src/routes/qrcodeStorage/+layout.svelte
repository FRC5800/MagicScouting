<script>
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { goto } from '$app/navigation';
    import { _ } from "svelte-i18n";

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-[#060024] p-2 dark:text-white">
    <header class="flex flex-row justify-center w-full p-2 text-3xl font-bold items-centers">
        <i class="absolute top-6 left-6 fa-solid fa-angle-left" on:click={() => {goto('/')}}></i>
        <h1>{$_('storage.title')}</h1>
    </header>
    <div class="separator"></div>
    <slot />
</main>
