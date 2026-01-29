<script>
    import { run } from 'svelte/legacy';

	import { fade } from "svelte/transition";


    /**
     * @typedef {Object} Props
     * @property {boolean} [showToast]
     * @property {string} [message]
     */

    /** @type {Props} */
    let { showToast = $bindable(false), message = "Default Toast message" } = $props();

    run(() => {
        if(showToast) {
            setTimeout(() => {
                showToast = false;
            }, 3000); // Disappears after 3 seconds
        }
    });

</script>

<div transition:fade class="toast toast-top toast-end z-50">
    {#if showToast}
      <div class="alert alert-warning shadow-lg">
        <span class="select-none">{message}</span>
      </div>
    {/if}
</div>