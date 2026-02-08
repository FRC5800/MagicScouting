<script>
  import { _ } from "svelte-i18n";
  import { goto } from '$app/navigation';
  import teamImage from'$lib/assets/frc1156.png';
  import EntryToSync from '$lib/components/EntryToSync.svelte';
  import { entriesSync, syncedEntries} from '$lib/shared/stores/toSyncData.js';
  import { App } from '@capacitor/app';
	import SyncedEntries from "$lib/components/SyncedEntries.svelte";

  App.addListener("backButton", ()=>{goto('/')});

  let displayFilter = $state("all");
  
</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white mb-16">
  <div class="w-full flex grow gap-4 px-6 mt-6 mb-6 flex-col items-start">
    <h1 class="text-2xl font-medium tracking-wide">{$_('storage.title')}</h1>
    <div class="w-full flex flex-row gap-2">
      <button onclick={()=>{displayFilter="all"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="all" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
        {$_('storage.filters.all')}
      </button>
      <button onclick={()=>{displayFilter="not-sent"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="not-sent" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
        {$_('storage.filters.not_sent')}
      </button>
      <button onclick={()=>{displayFilter="sent"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="sent" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
        {$_('storage.filters.sent')}
      </button>
    </div>        
  </div>

  {#if displayFilter=="all" || displayFilter=="not-sent"}
    <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
      <h2 class="text-xl font-medium tracking-wide">{$_('storage.filters.not_sent')}</h2>
      {#key $entriesSync}
        {#each $entriesSync as entry, index}
          <EntryToSync {index} payload={entry}/>
        {/each}
      {/key}
      <div class="w-full rounded-badge pt-3">
        {#if $entriesSync.length == 0}
          <div class="flex justify-center w-full py-10 italic font-extrabold border-2 border-gray-700 rounded-lg">
            <h2>{$_('storage.empty_message')}</h2>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if displayFilter=="all" || displayFilter=="sent"}
    <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
      <h2 class="text-xl font-medium tracking-wide">{$_('storage.filters.sent')}</h2>
      {#key $syncedEntries}  
        {#each $syncedEntries as entry, index}
          <SyncedEntries {index} payload={entry}/>
        {/each}
      {/key}
      <div class="w-full rounded-badge pt-3">
        {#if $syncedEntries.length == 0}
          <div class="flex justify-center w-full py-10 italic font-extrabold border-2 border-gray-700 rounded-lg">
            <h2>{$_('storage.empty_message')}</h2>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</main>

<style>

  .bolas2{
    background-color: rgba(26, 148, 255, 0.3);
  }
  h1{
    font-family: "Outfit";
    font-weight: 600;
  }
  h2{
    font-family: "Outfit";
    font-weight: 600;
  }

</style>