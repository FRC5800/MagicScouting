<script>
	import { goto } from "$app/navigation";
	import { _ } from "svelte-i18n";
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="flex flex-row items-start justify-center p-6 text-neutral-600 dark:text-white app">
	<main class="flex flex-col items-center justify-center">
		<i class="absolute z-10 text-2xl text-white top-4 left-6 fa-solid fa-angle-left" onclick={() => {goto('/')}}></i>
		<h1 class="text-4xl text-primary-heavy dark:text-white">{$_('about.title')}</h1>

		<div class="w-[30vw] separator mb-1"></div>
		{@render children?.()}
	</main>

</div>