<script>
	// @ts-nocheck
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n'

	export let options = [];
	export let name = "";

	export let defaultOption = "Select an option"

	export let value = '';

	export const dispatch = createEventDispatcher();
	export let handler = function(){console.log("Without handler")}
</script>

<select name={name} bind:value={value} on:change={handler} class="select select-bordered w-full text-base text-inherit">
	<option disabled selected hidden value="">{defaultOption}</option>
	{#if options==[]}
		<slot/>
	{/if}
	{#if options!=[]}
		{#each options as opt}
			<option value={opt.value}>{opt.content}</option>
		{/each}
	{/if}
</select>