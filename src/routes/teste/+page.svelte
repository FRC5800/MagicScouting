<script lang="ts">
	// Svelte 5 + Runes example component
	// Approximates the first image's layout but in the modern form factor of the second image.

	//@ts-nocheck
	// Runes (Svelte 5) reactive state
	let hubScore = $state(41);

	let collectionOptions = $state({'Chao':false, 'Outpost':false, 'Neutral':false, 'Depot':false});

	let climb = $state(false); // false = NAO, true = SIM

	function addHub(value: number) {
		hubScore += value;
	}


	$effect(() => {
	  console.log($state.snapshot(collectionOptions))
	})

</script>

<section class="min-h-screen flex flex-col items-center justify-start bg-neutral-900 text-white py-8 px-4">
	<!-- Top logo / header in modern card style like second image -->
		<!-- HUB SCORES card -->
		<div class="text-center">
			<div class="text-sm text-blue-300 font-semibold mb-2">HUB SCORES</div>
			<div class="flex items-center justify-center gap-3">
				<!-- penalty badge -->
				<button class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow" onclick={() => addHub(-1)}> -1</button>

				<!-- main hub score block -->
				<div class="bg-blue-600 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
					<div class="w-16 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-2xl font-extrabold">{hubScore}</div>
					<div class="grid grid-cols-3 gap-1">
						<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => addHub(1)}>+1</button>
						<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => addHub(5)}>+5</button>
						<button class="px-3 py-1 rounded-md bg-blue-400 hover:bg-blue-500 font-semibold" onclick={() => addHub(10)}>+10</button>
					</div>
				</div>

				<!-- thumbnail placeholder -->
				<div class="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-500">
					<img src="/assets/hub-thumb.png" alt="hub" class="w-full h-full object-cover" onerror={(e)=>{ /* replace with your image path */ }}/>
				</div>
			</div>
		</div>

		<!-- Collection segmented control (pills) -->
		<section>
			<h3 class="text-lg font-bold text-center mb-3">Coleta de:</h3>
			<div class="flex items-center justify-between gap-2 bg-neutral-700 p-2 rounded-full">
				{#each Object.keys(collectionOptions) as opt}
    				<button
    					onclick={() => {collectionOptions[opt] = !collectionOptions[opt]}}
    					id="climb"
    					class="btn p-2 rounded-xl box-border border-2 dark:border-0 {collectionOptions[opt]
    						? ' text-white bg-primary-base border-primary-base'
    						: 'text-neutral-600 bg-transparent dark:bg-slate-100 border-gray-700'}">{opt}
    				</button>
				{/each}
			</div>
		</section>
		<br>
		<br>
		<br>
		<!-- Climb with small preview image and toggle -->
		<button
			onclick={() => {climb = !climb;}}
			id="climb"
			class="btn btn-block p-2 rounded-xl box-border border-2 dark:border-0 {climb
				? ' text-white bg-primary-base border-primary-base'
				: 'text-neutral-600 bg-transparent dark:bg-slate-100 border-gray-700'}">Climb
		</button>


		<br>
		<br>
		<!-- Total and Continue -->
		<div class="flex flex-col gap-3">
			<button class="w-full bg-blue-500 py-3 rounded-xl font-bold shadow-md hover:bg-blue-600" onclick={onSubmit}>CONTINUAR</button>
		</div>
</section>
