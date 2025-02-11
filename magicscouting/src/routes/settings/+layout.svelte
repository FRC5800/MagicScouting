<script>
  import { _ } from 'svelte-i18n';
</script>
<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex grow gap-4 px-6 pt-6 pb-3 mb-4 flex-col items-center rounded-b-xl">
      <h1 class="text-2xl font-medium tracking-wide">{$_('home_page.settings.title')}</h1>       
    </div>

    <div class="px-6 w-full">
        <slot/>
    </div>
</main>