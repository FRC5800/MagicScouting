<script>
    import { _ } from "svelte-i18n";
    import EntryToSync from '../../lib/components/EntryToSync.svelte';
    import entriesToSync from '../../lib/shared/stores/toSyncData.js';
    import { App } from '@capacitor/app';
    import { goto } from '$app/navigation';

    App.addListener("backButton", ()=>{goto('/')});

</script>

{#each $entriesToSync as entry}
    <EntryToSync payload={entry}/>
{/each}

{#if $entriesToSync.length == 0}
  <div class="flex justify-center w-full py-10 italic font-extrabold border-2 border-gray-700 rounded-lg text-slate-300">
    <h2>{$_('storage.empty_message')}</h2>
  </div>
{/if}

