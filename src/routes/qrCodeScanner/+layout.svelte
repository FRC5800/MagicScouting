<script>
    import { goto } from "$app/navigation";
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="app">
	<main class="flex flex-col items-center justify-center p-2">
		{@render children?.()}
	</main>

</div>