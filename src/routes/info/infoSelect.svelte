<script>

    
    /**
     * @typedef {Object} Props
     * @property {any} instance_options
     * @property {any} [options]
     * @property {any} [name]
     * @property {any} [content]
     * @property {boolean} [selectedOption]
     * @property {string} [width]
     */

    /** @type {Props} */
    let {
        instance_options,
        options = instance_options.options,
        name = instance_options.name,
        content = instance_options.content,
        selectedOption = $bindable(false),
        width = ''
    } = $props();
</script>

<div class="box-border flex flex-row overflow-auto overflow-y-hidden rounded-lg border-[3px] border-neutral-800 dark:bg-grey-heavy">
    {#each options as option (option.id)}
        <input id="{name}-{option.id}" value="{option.value}" type="radio" bind:group={selectedOption} class="appearance-none"/>
        <label for="{name}-{option.id}" style="--width: {width}" class=" width px-3 py-2 align-middle text-center border-l border-[#060024] {option.value == selectedOption ? 'selected text-white' : ''}">{content[option.id]}</label>
    {/each}
</div>

<style lang="postcss">
    .selected {
        @apply bg-primary-base;
    }

    .width{
        width: var(--width);
    }
    
</style>