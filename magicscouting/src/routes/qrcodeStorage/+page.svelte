<script>
    import { _ } from "svelte-i18n";
    import EntryToSync from '../../lib/components/EntryToSync.svelte';
    import entriesToSync from '../../lib/shared/stores/toSyncData.js';

    console.log($entriesToSync);
</script>

{#each $entriesToSync as entry}
    <EntryToSync payload={entry}/>
{/each}

{#if $entriesToSync.length == 0}
  <div class="flex justify-center w-full py-10  text-slate-300 font-extrabold italic border-2 border-gray-700 rounded-lg">
    <h2>{$_('storage.empty_message')}</h2>
  </div>
{/if}

