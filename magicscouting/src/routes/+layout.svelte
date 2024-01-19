<script>
	import './styles.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { beforeUpdate } from 'svelte';
	import theme from '$lib/shared/stores/darkMode.js';

	beforeUpdate(() => {
		let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		document.querySelector('html').classList.add($theme == 'sistema' ? systemTheme : $theme);
	});
</script>

<div class="flex app">
	<main class="bg-[#EAEAEC] dark:bg-[#060024]">
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
