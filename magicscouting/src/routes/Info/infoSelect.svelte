<script>

    export let instance_options;
    
    export let options = instance_options.options;
    export let name = instance_options.name;
    export let content = instance_options.content;
    export let selectedOption = '';
    export let width = '';
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