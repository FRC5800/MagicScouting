<script>
    import { _ } from 'svelte-i18n'
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="flex flex-row items-start justify-center p-6 text-neutral-600 dark:text-white app mb-16">
	<main class="flex flex-col items-center justify-center">
		<h1 class="text-2xl font-bold text-primary-heavy dark:text-white">{$_('info.title')}</h1>

		<div class="w-[30vw] separator mb-1"></div>
		{@render children?.()}
	</main>

</div>