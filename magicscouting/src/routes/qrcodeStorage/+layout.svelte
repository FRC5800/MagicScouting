<script>
    import { _ } from "svelte-i18n";
    import { goto } from '$app/navigation';
    
    import '@fortawesome/fontawesome-free/css/all.min.css';

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <header class="flex flex-row justify-center w-full p-2 text-3xl font-bold items-centers">
        <i tabindex="0" role="button" on:keydown={(e) => {goto('/')}} class="absolute top-6 left-6 fa-solid fa-angle-left" on:click={() => {goto('/')}}></i>
        <h1>{$_('storage.title')}</h1>
    </header>
    <div class="separator"></div>
    <slot />
</main>
