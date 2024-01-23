<script>
	import './styles.css';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { beforeUpdate } from 'svelte';
	import theme from '$lib/shared/stores/darkMode.js';
	import { waitLocale } from 'svelte-i18n'

	export async function preload() {
	// awaits for the loading of the 'en-US' and 'en' dictionaries
	return waitLocale()
	}
	
	beforeUpdate(() => {
		let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		document.querySelector('html')?.classList.add($theme == 'system' ? systemTheme : $theme);
	});
</script>

<div class="flex app">
	<main class="bg-[#EAEAEC] dark:bg-[#060024] p-2">
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	main {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
</style>
