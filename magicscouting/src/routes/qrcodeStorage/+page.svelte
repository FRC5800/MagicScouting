<script>
    import EntryToSync from '../../lib/components/EntryToSync.svelte';
    import entriesToSync from '../../lib/shared/stores/toSyncData.js';
    import QRCode from "qrcode";
    import TrashCan from '$lib/components/TrashCan.svelte'
    import Modal from '../Modal.svelte';

    console.log($entriesToSync);
</script>
{#each $entriesToSync as entry}
    <EntryToSync payload={entry}/>
{/each}
{#if $entriesToSync.length == 0}
  <p>Notihing to see here</p>
{/if}

