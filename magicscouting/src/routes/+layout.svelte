<script>
	import './styles.css';
	import '../app.css';
	// import '@fortawesome/fontawesome-free/css/all.min.css';
	import { beforeUpdate } from 'svelte';
	import theme from '$lib/shared/stores/darkMode.js';
	import colorTheme from '$lib/shared/stores/colorTheme.js';
	import { waitLocale } from 'svelte-i18n'
	import { fade } from 'svelte/transition';

	export async function preload() {
	// awaits for the loading of the 'en-US' and 'en' dictionaries
	return waitLocale()
	}
	
	beforeUpdate(() => {
		let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		document.querySelector('html')?.classList.add($theme == 'system' ? systemTheme : $theme);
		document.querySelector('html')?.setAttribute('data-theme', $colorTheme);
	});
</script>

<div class="bg-[#EAEAEC] dark:bg-primary-heavy app">
	{#await preload()	}
	<div out:fade={{ delay: 0, duration: 500 }} class="loader"></div>
	{:then resolved} 
	<main class="flex-col">
		<slot />
	</main>
	{/await}
</div>

<style lang="postcss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	main {
		min-height: 100vh;
		display: flex;
		/* justify-content: center; */
		align-items: center;
	}
	
	.loader {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #333333;
		z-index: 1;
	}

	.loader::after {
		content: '';
		width: 50px;
		height: 50px;
		border: 10px solid #dddddd;
		border-top-color: #009578;
		border-radius: 50%;
		animation: loading 0.75s ease infinite;
	}

	@keyframes loading {
		from {
			transform: rotate(0turn);
		}
		to {
			transform: rotate(1turn);
		}
	}

</style>
