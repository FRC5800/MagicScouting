<script>
  import { _ } from "svelte-i18n";
  import { goto } from '$app/navigation';
  import teamImage from'$lib/assets/frc1156.png';
  import EntryToSync from '$lib/components/EntryToSync.svelte';
  import { entriesSync, syncedEntries} from '$lib/shared/stores/toSyncData.js';
  import { App } from '@capacitor/app';
	import SyncedEntries from "$lib/components/SyncedEntries.svelte";

  App.addListener("backButton", ()=>{goto('/')});

  let displayFilter = "all";
  
</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
  <div class="w-full flex grow gap-4 px-6 mt-6 mb-6 flex-col items-start">
    <h1 class="text-2xl font-medium tracking-wide">My Storage</h1>
    <div class="w-full flex flex-row gap-2">
      <button on:click={()=>{displayFilter="all"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="all" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
        All
      </button>
      <button on:click={()=>{displayFilter="not-sent"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="not-sent" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
        Not Sent
      </button>
      <button on:click={()=>{displayFilter="sent"}} class="py-2 px-4 text-sm w-fit rounded-md font-medium {displayFilter=="sent" ? "box-border border-2 text-primary-light border-primary-light" : "text-primary-light bg-primary-opac"}">
        Sent
      </button>
    </div>        
  </div>

  {#if displayFilter=="all" || displayFilter=="not-sent"}
    <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
      <h2 class="text-xl font-medium tracking-wide">Not Sent</h2>
      <!-- <div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamImage} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team 1156 - Under Control</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>Match: 32</span>
            <span>Position: 2</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button class="btn grow">Visualize</button>
            <button class="btn btn-circle btn-disabled">
              <i class="fi fi-rs-check-circle text-2xl"></i>
            </button>
          </div>
        </div>
      </div> -->
      {#each $entriesSync as entry}
        <EntryToSync payload={entry}/>
      {/each}
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
      <h2 class="text-xl font-medium tracking-wide">Sent</h2>
      {#each $syncedEntries as entry}
        <SyncedEntries payload={entry}/>
      {/each}
      <div class="w-full rounded-badge pt-3">
        {#if $syncedEntries.length == 0}
          <div class="flex justify-center w-full py-10 italic font-extrabold border-2 border-gray-700 rounded-lg">
            <h2>{$_('storage.empty_message')}</h2>
          </div>
        {/if}
      </div>
      <!-- <div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamImage} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Edit</li>
            <li>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team 1156 - Under Control</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>Match: 32</span>
            <span>Position: 2</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button class="btn grow">Visualize</button>
            <button class="btn btn-circle">
              <i class="fi fi-rr-progress-upload text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamImage} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Edit</li>
            <li>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team 1156 - Under Control</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>Match: 32</span>
            <span>Position: 2</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button class="btn grow">Visualize</button>
            <button class="btn btn-circle">
              <i class="fi fi-rr-progress-upload text-2xl"></i>
            </button>
          </div>
        </div>
      </div> -->
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