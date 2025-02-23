<script>
  // @ts-nocheck
  
    import SelectInput from '$lib/components/SelectInput.svelte';
    import theme from '$lib/shared/stores/darkMode.js';
    import colorTheme from '$lib/shared/stores/colorTheme.js';
    import { locale, _ } from 'svelte-i18n';
    import dataBase from '$lib/shared/stores/dataBase';
    import { useDB }  from '$lib/shared/stores/dataBase';
    import { goto } from '$app/navigation';
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let showDataBase = false;
    $: team_database = $useDB ? $dataBase : '';
  
    let linguagens = [
      { id: '1', content: 'English', value: 'en' },
      { id: '2', content: 'Português (Brasil)', value: 'pt-BR' },
      { id: '3', content: 'Español', value: 'es' }
    ];
  
    $: themes = [
      { id: '1', content: $_('home_page.settings.option_theme.option_light'), value: 'light' },
      { id: '2', content: $_('home_page.settings.option_theme.option_dark'), value: 'dark' },
      { id: '3', content: $_('home_page.settings.option_theme.option_system'), value: 'system' }
    ];
  
    let colors = [
      { content: 'blue', color: "#35CEE8", background: 'checked:bg-[#35CEE8]' },
      { content: 'purple', color: "#9235E8", background: 'checked:bg-[#9235E8]' },
      { content: 'red', color: "#E8281E", background: 'checked:bg-[#E8281E]' },
      { content: 'green', color: "#35E89A", background: 'checked:bg-[#35E89A]' },
      { content: 'pink', color: "#D92793", background: 'checked:bg-[#D92793]' }
    ];
  
    let showMoreThemes = 'hidden';
    let showMoreLanguages = 'hidden';
  
    // @ts-ignore
    let selected_language = $locale;
    let selected_theme = $theme;
    let selected_color = $colorTheme;
    $: if(selected_color != $colorTheme) {
      $colorTheme = selected_color;
      document.querySelector("html")?.setAttribute("theme", $colorTheme);
    }
    $: $colorTheme = selected_color;
  
    function handle_theme_selection() {
      $theme = selected_theme;
      console.log("bolos")
      let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      let htmlTagClasses = document.querySelector('html').classList;
      if ($theme == 'dark') {
			htmlTagClasses.remove('light');
			htmlTagClasses.add('dark');
			document.querySelector('html')?.setAttribute('data-theme', 'dark');
		} else if ($theme == 'light') {
			htmlTagClasses.remove('dark');
			htmlTagClasses.add('light');
			document.querySelector('html')?.setAttribute('data-theme', 'light');
		} else {
			htmlTagClasses.remove('dark');
			htmlTagClasses.remove('light');
			htmlTagClasses.add(systemTheme);
			document.querySelector('html')?.setAttribute('data-theme', systemTheme);
		}
    }
  
    function handle_language_selection() {
      $locale = selected_language;
      window.localStorage.setItem('language', $locale);
    }
  
    function handleDataBase() {
        if (team_database.includes("script.google")){
            $dataBase = team_database[team_database.length-1] == "?" ? team_database : team_database + "?";
            showDataBase = false;
        }else{
            alert("Url invalido");
        }        
    }
    let showDatabaseConfirm = false;

    function triggerToast() {
      if (team_database.includes("script.google")){
        showDatabaseConfirm = true;
        
        setTimeout(() => {
          showDatabaseConfirm = false;
        }, 3000); // Disappears after 3 seconds
      }
    }

    let showDatabaseAlert = false;

      function handleToggleChange() {
        if (JSON.parse($useDB) == "") {
          showDatabaseAlert = true;
          setTimeout(() => {
            showDatabaseAlert = false;
          }, 3000);
        }
      }
  </script>

<div class="w-full flex grow gap-4 mb-6 flex-col items-start">
  <h2 class="text-xl font-medium tracking-wide">{$_('home_page.settings.language_title')}</h2>
  <SelectInput
      options={linguagens}
      bind:value={selected_language}
      name={'language'}
      handler={handle_language_selection}
    />
</div>

<div class="w-full flex grow gap-4 mb-6 flex-col items-start">
  <h2 class="text-xl font-medium tracking-wide">{$_('home_page.settings.themes_title')}</h2>
  <SelectInput
      options={themes}
      bind:value={selected_theme}
      name={'theme'}
      handler={handle_theme_selection}
    />
</div>

<div class="w-full flex grow gap-4 mb-6 flex-col items-start">
  <h2 class="text-xl font-medium tracking-wide">{$_('home_page.settings.colors_title')}</h2>
  <div
    class="input input-bordered flex flex-row justify-around flex-wrap w-full h-fit p-1"
    id="colorContainer"
  >
    {#each colors as color}
    <input type="radio" name="colors" value={color.content} class="radio h-12 w-12 border-[{color.color}] color-[{color.color}] outline-[{color.color}] {color.background}" bind:group={selected_color}/>
    {/each}
  </div>
</div>

<div class="w-full flex grow gap-4 mb-6 flex-col items-start">
  <div class="flex flex-row w-full gap-4 items-center">
    <h2 class="text-xl font-medium tracking-wide">{$_('home_page.database.title')}</h2>
    <div class="form-control">
      <label class="label cursor-pointer">
        <input type="checkbox" class="toggle toggle-success" name="useDB" checked={JSON.parse($useDB)}
        on:click={(params) => {
          $useDB = !$useDB
      }} 
        on:change={()=>{handleToggleChange()}}/>
      </label>
    </div>
  </div>
  <div class="flex flex-col items-center">
      <p class="text-base text-justify text-gray-600 dark:text-gray-400">{$_('home_page.database.message')} <a href="https://github.com/FRC5800/MagicScouting" class="m-4 underline text-primary-base">{$_('home_page.database.repository')}</a></p>
  </div>
  <div class="flex flex-col items-center rounded-md min-w-fit useDatabase">
      <div class="center-container">
        
      </div>
  </div>
  <div class="flex flex-row gap-2 w-full">
  <input disabled={!JSON.parse($useDB)} type="text" bind:value={team_database} placeholder="Database" class="input input-bordered p-2 text-base rounded-md grow ">
  <button disabled={!JSON.parse($useDB)} on:click={()=>{handleDataBase();triggerToast()}} class="{JSON.parse($useDB) ? '' : 'disabled-btn'} btn-primary hover:bg-primary-base bg-buttons border-buttons p-2 px-4 w-fit rounded-lg btn  mt-0 min-w-8">
    <i class="fi fi-br-angle-right text-xl flex"></i>
  </button>
  </div>
</div>

<div transition:fade class="toast toast-top toast-end">
  {#if showDatabaseConfirm}
    <div class="alert alert-success shadow-lg">
      <span>Database saved</span>
    </div>
  {/if}
  {#if showDatabaseAlert}
    <div class="alert alert-warning shadow-lg max-w-xs">
      <span class="text-wrap">Warning! You can't make uploads without a database</span>
    </div>
  {/if}
</div>

<style lang="postcss">

</style>