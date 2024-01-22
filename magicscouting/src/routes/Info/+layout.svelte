<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
</script>

<div class="flex flex-row items-start justify-center p-6 text-neutral-600 dark:text-white app">
	<main class="flex flex-col items-center justify-center">
		<h1 class="text-4xl text-neutral-900 dark:text-white">Função na Partida</h1>

		<div class="w-[30vw] separator mb-1"></div>
		<slot />
	</main>

</div>