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
        <input id="{name}-{option.value}" value="{option.value}" type="radio" bind:group={selectedOption} class="hidden"/>
        <label for="{name}-{option.value}" style="--width: {width}" class=" width px-3 py-2 align-middle text-center border-l border-[#060024] {option.value == selectedOption ? 'selected text-white' : ''}">{content[option.id]}</label>
    {/each}
</div>

<style lang="postcss">
    .selected {
        background-color: theme(backgroundColor.blue.600);
    }

    .width{
        width: var(--width);
    }
    
</style>