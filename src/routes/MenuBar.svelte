<script>
    import { createBubbler, stopPropagation } from 'svelte/legacy';

    const bubble = createBubbler();
    // import '@fortawesome/fontawesome-free/css/all.min.css'

</script>

<i tabindex="0" role="button" class="z-10 text-[#474747] dark:text-white fi fi-rr-menu-burger hover:cursor-pointer" onkeydown={stopPropagation(bubble('keydown'))} onclick={stopPropagation(bubble('click'))}></i>

<style lang="postcss">
    i{
        font-size: 2rem;
        position: absolute;
        left: 1em;
        top: 0.5em;
    }
</style>