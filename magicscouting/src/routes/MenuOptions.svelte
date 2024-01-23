<script>
    import { _ } from 'svelte-i18n'
</script>

<h1 class="text-2xl">{$_('home_page.menu.title')}</h1>
<div class="separator" style="width: 50%;"></div>

<div class="flex flex-col items-center px-[5vw] sm:px-[5vw] font-defaultText font-bold text-[1.2rem]">
    <div tabindex="0" role="button" on:keydown class="py-2 cursor-pointer option" on:click>{$_('home_page.menu.option_config')}</div>
    <hr class="border-[#666666] w-[100%] h-1"/>
    <div class="py-2 option">{$_('home_page.menu.option_guide')}</div>
    <hr class="border-[#666666] w-[100%] h-1">
    <div class="py-2 pb-10 option">{$_('home_page.menu.option_about')}</div>
</div>

<div class="flex flex-row justify-around w-[100%] text-[1.8rem]">
    <a href="https://www.instagram.com/frc5800/"><i class="fa-brands fa-instagram"></i></a>
    <a href="https://github.com/FRC5800/"><i class="fa-brands fa-github"></i></a>
    <a href="https://www.tiktok.com/@frc.5800"><i class="fa-brands fa-tiktok"></i></a>
    <a href="https://www.youtube.com/@FRC5800"><i class="fa-brands fa-youtube"></i></a>
</div>

<style>
    .option:hover{
        text-shadow: 0 0 1rem #5DE0E6;
    }
</style>