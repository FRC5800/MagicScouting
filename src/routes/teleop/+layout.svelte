<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
    /** @type {import('./$types').LayoutData} */

</script>

{@render children?.()}
