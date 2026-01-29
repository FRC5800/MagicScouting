<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();

</script>

	<main class="mb-20 max-w-96">
		{@render children?.()}
	</main>
