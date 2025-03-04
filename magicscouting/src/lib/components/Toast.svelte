<script>
	import { fade } from "svelte/transition";


    export let showToast = false;
    export let message = "Default Toast message";

    $: if(showToast) {
        setTimeout(() => {
            showToast = false;
        }, 3000); // Disappears after 3 seconds
    }

</script>

<div transition:fade class="toast toast-top toast-end">
    {#if showToast}
      <div class="alert alert-warning shadow-lg">
        <span class="select-none">{message}</span>
      </div>
    {/if}
</div>