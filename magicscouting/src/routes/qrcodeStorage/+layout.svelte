<script>
    import { _ } from "svelte-i18n";
    import { goto } from '$app/navigation';
    
    // import '@fortawesome/fontawesome-free/css/all.min.css';

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex grow gap-3 ml-6 items-center mt-4 mb-4">
        <i class="fi fi-rr-database text-2xl"></i>
        <h1 class="text-2xl font-medium tracking-wide">Storage</h1>
    </div>

    <div class="bg-slate-800 w-full h-screen rounded-badge pt-3 px-3">
        <slot />
    </div>
</main>

<div class="btm-nav">
    <button on:click={()=>{goto('/')}}>
      <i class="fi fi-rr-home"></i>
    </button>
    <button class="active">
      <i class="fi fi-rr-database"></i>
    </button>
    <button>
      <i class="fi fi-rr-camera"></i>
    </button>
    <button>
      <i class="fi fi-rr-chart-histogram"></i>
    </button>
    <button>
      <i class="fi fi-rr-settings-sliders"></i>
    </button>
  </div>

<style>
    i::before{
    display: block;
  }
</style>