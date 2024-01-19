<script>

 export let options = [{id: NaN, value: 'undefined'}];
/**
	 * @type {string[]}
	 */
export let content;
export let selectedOption = ''
export let width = '';
</script>

<div class="box-border flex flex-row overflow-auto overflow-y-hidden rounded-lg bg-grey-heavy">
    {#each options as option (option.id)}
        <input id="{option.value}" value="{option.value}" type="radio" bind:group={selectedOption} class="hidden"/>
        <label for="{option.value}" style="--width: {width}" class=" width px-3 py-2 align-middle text-center border-l border-[#060024] {option.value == selectedOption ? 'selected' : ''}">{content[option.id]}</label>
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