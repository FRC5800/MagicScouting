<script>
	// @ts-nocheck
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n'




	export const dispatch = createEventDispatcher();
	/**
	 * @typedef {Object} Props
	 * @property {any} [options]
	 * @property {string} [name]
	 * @property {string} [defaultOption]
	 * @property {string} [value]
	 * @property {any} [handler]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let {
		options = [],
		name = "",
		defaultOption = "Select an option",
		value = $bindable(''),
		handler = function(){console.log("Without handler")},
		children
	} = $props();
</script>

<select name={name} bind:value={value} onchange={handler} class="select select-bordered w-full text-base text-inherit">
	<option disabled selected hidden value="">{defaultOption}</option>
	{#if options==[]}
		{@render children?.()}
	{/if}
	{#if options!=[]}
		{#each options as opt}
			<option value={opt.value}>{opt.content}</option>
		{/each}
	{/if}
</select>