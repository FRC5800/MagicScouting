<script>
	/**
	 * @type {boolean}
	 */
	export let showModal;
	/**
	 * @type {boolean}
	 */
	export let showConfig;

	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();

	function handleClose() {
		showModal = false;
		showConfig = false;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={handleClose}
	on:click|self={() => dialog.close()}
	class="bg-[#EAEAEC] dark:bg-primary-heavy dark:border-4 text-[#393939] dark:text-white dark:border-[#2E2947]"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="py-4 px-[5vw] sm:px-[15vw] h-[55vh] w-[60vw] max-sm:w-fit min-w-[60vw]">
		<i
			class="fa-solid fa-x absolute top-[1em] right-[1em] hover:cursor-pointer"
			on:click={() => {
				dialog.close();
			}}
		></i>
		{#if showConfig}
			<i
				class="fa-solid fa-arrow-left absolute top-[1em] left-[1em] hover:cursor-pointer"
				on:click={() => {
					(showConfig = false), (showModal = true);
				}}
			></i>
		{/if}
		<slot name="header" />
		<hr />
		<slot />
		<hr />
	</div>
</dialog>

<style>
	dialog {
		/* max-width: 32em; */
		border-radius: 0.5em;
		padding: 0;
		overflow: visible;
	}
	dialog::backdrop {
		background: rgba(61, 60, 60, 0.5);
		box-shadow: 0px 2px 5px 5px rgba(45, 144, 169, 0.1);
	}
	dialog > div {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		border-radius: 0.5rem;
		box-shadow: 0px 2px 5px 5px rgba(0, 0, 0, 0.3);
		justify-content: space-around;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
	i:hover {
		text-shadow:
			-1px -1px 2px rgba(0, 0, 0, 0.3),
			1px 1px 2px rgba(255, 255, 255, 0.4);
	}
</style>
