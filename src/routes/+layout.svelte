<!-- @migration-task Error while migrating Svelte code: Can't migrate code with beforeUpdate. Please migrate by hand. -->
<script>
// @ts-nocheck

	import './styles.css';
	import '../app.css';
	import { page } from '$app/stores';
	import theme from '$lib/shared/stores/darkMode.js';
	import { carbonTheme } from '$lib/shared/stores/darkMode.js';
	import colorTheme from '$lib/shared/stores/colorTheme.js';
	import { waitLocale } from 'svelte-i18n'
	import { fade } from 'svelte/transition';
	import { goto, beforeNavigate } from '$app/navigation';

	import '@carbon/charts-svelte/styles.css'

	export async function preload() {
	// awaits for the loading of the 'en-US' and 'en' dictionaries
	return waitLocale()
	}

	let isNavigating = $state(false);
	let navigationTimeout;

	function isActive(path) {
		return $page.url.pathname === path;
	}

	// Handle theme updates using $effect instead of beforeUpdate
	$effect(() => {
		let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		document.querySelector('html')?.setAttribute('data-theme', $theme == 'system' ? systemTheme : $theme);
		document.querySelector('html')?.classList.add($theme == 'system' ? systemTheme : $theme);
		document.querySelector('html')?.setAttribute('theme', $colorTheme);
	});

	function handleNavigation(path) {
		// Prevent multiple simultaneous navigations
		if (isNavigating) {
			return;
		}

		// Clear any pending navigation timeout
		if (navigationTimeout) {
			clearTimeout(navigationTimeout);
		}

		// Don't navigate if already on that page
		if ($page.url.pathname === path) {
			return;
		}

		isNavigating = true;
		
		// Navigate immediately
		goto(path, {
			noScroll: false,
			replaceState: false,
			invalidateAll: false
		}).finally(() => {
			// Reset navigation state after a short delay
			navigationTimeout = setTimeout(() => {
				isNavigating = false;
			}, 100);
		});
	}

	// Cancel any pending navigation when a new one starts
	beforeNavigate(() => {
		if (navigationTimeout) {
			clearTimeout(navigationTimeout);
		}
	});
</script>

<div class="bg-[#EAEAEC] dark:bg-primary-heavy app">
	{#await preload()	}
	<div out:fade={{ delay: 0, duration: 500 }} class="loader">
		<div class="loader-content">
			<div class="loader-logo">
				<svg xmlns="http://www.w3.org/2000/svg" class="dark:fill-white scale-[1.2] logo-svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="80vw" zoomAndPan="magnify" viewBox="0 0 224.87999 74.999997" height="90" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><g/></defs><g class="fill-primary-base dark:fill-primary-base" fill-opacity="1"><g transform="translate(-0.657527, 48.081926)"><g><path d="M 17.34375 -5.1875 L 10.296875 -14.234375 L 7.15625 0 L 1.15625 0 L 7.15625 -26.796875 L 17.34375 -13.625 L 27.515625 -26.796875 L 33.515625 0 L 27.515625 0 L 24.375 -14.234375 Z M 17.34375 -5.1875 "/></g></g></g><g fill-opacity="1"><g transform="translate(52.39695, 48.175506)"><g/></g><g transform="translate(57.186879, 48.175506)"><g/></g><g transform="translate(61.976808, 48.175506)"><g/></g><g transform="translate(66.766737, 48.175506)"><g/></g><g transform="translate(71.556666, 48.175506)"><g/></g><g transform="translate(76.346595, 48.175506)"><g/></g><g transform="translate(81.136525, 48.175506)"><g/></g><g transform="translate(85.926454, 48.175506)"><g/></g><g transform="translate(90.716383, 48.175506)"><g/></g><g transform="translate(95.506312, 48.175506)"><g/></g><g transform="translate(100.296241, 48.175506)"><g/></g><g transform="translate(105.08617, 48.175506)"><g/></g><g transform="translate(109.8761, 48.175506)"><g/></g><g transform="translate(114.666029, 48.175506)"><g/></g></g><g fill-opacity="1"><g transform="translate(119.455958, 48.175506)"><g><path d="M 2.4375 -14.859375 L 16 -14.859375 L 16 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 16 -2.921875 L 16 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g><g transform="translate(136.115331, 48.175506)"><g><path d="M 14.234375 -14.859375 C 14.710938 -14.859375 15.125 -14.679688 15.46875 -14.328125 C 15.820312 -13.984375 16 -13.570312 16 -13.09375 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.957031 0 1.539062 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.539062 -14.679688 1.957031 -14.859375 2.4375 -14.859375 Z M 12.515625 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 12.515625 -2.921875 Z M 12.515625 -11.9375 "/></g></g><g transform="translate(152.784285, 48.175506)"><g><path d="M 12.5 -14.859375 L 16 -14.859375 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 -2.921875 L 12.5 -2.921875 Z M 12.5 -14.859375 "/></g></g><g transform="translate(169.443658, 48.175506)"><g><path d="M 16 -14.859375 L 16 -11.9375 L 10.078125 -11.9375 L 10.078125 0 L 6.578125 0 L 6.578125 -11.9375 L 0.671875 -11.9375 L 0.671875 -14.859375 Z M 16 -14.859375 "/></g></g><g transform="translate(186.103031, 48.175506)"><g><path d="M 0.671875 0 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 0 Z M 0.671875 0 "/></g></g><g transform="translate(190.93128, 48.175506)"><g><path d="M 4.15625 -8.515625 L 4.15625 0 L 0.671875 0 L 0.671875 -15.578125 L 12.5 -6.34375 L 12.5 -14.859375 L 16 -14.859375 L 16 0.71875 Z M 4.15625 -8.515625 "/></g></g><g transform="translate(207.590653, 48.175506)"><g><path d="M 2.4375 -14.859375 L 15.125 -14.859375 L 15.125 -11.9375 L 4.15625 -11.9375 L 4.15625 -2.921875 L 12.5 -2.921875 L 12.5 -5.96875 L 9 -5.96875 L 9 -8.890625 L 16 -8.890625 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g></g><g class="fill-primary-base dark:fill-primary-base" fill-opacity="1"><g transform="translate(34.668262, 48.175506)"><g><path d="M 2.4375 -14.859375 L 14.234375 -14.859375 C 14.710938 -14.859375 15.125 -14.679688 15.46875 -14.328125 C 15.820312 -13.984375 16 -13.570312 16 -13.09375 L 16 0 L 12.5 0 L 12.5 -4.515625 L 4.171875 -4.515625 L 4.171875 0 L 0.671875 0 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 12.5 -7.421875 L 12.5 -11.9375 L 4.171875 -11.9375 L 4.171875 -7.421875 Z M 12.5 -7.421875 "/></g></g><g transform="translate(51.337215, 48.175506)"><g><path d="M 2.4375 -14.859375 L 15.125 -14.859375 L 15.125 -11.9375 L 4.15625 -11.9375 L 4.15625 -2.921875 L 12.5 -2.921875 L 12.5 -5.96875 L 9 -5.96875 L 9 -8.890625 L 16 -8.890625 L 16 -1.765625 C 16 -1.273438 15.820312 -0.859375 15.46875 -0.515625 C 15.125 -0.171875 14.710938 0 14.234375 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g><g transform="translate(67.996589, 48.175506)"><g><path d="M 0.671875 0 L 0.671875 -14.859375 L 4.15625 -14.859375 L 4.15625 0 Z M 0.671875 0 "/></g></g><g transform="translate(72.824837, 48.175506)"><g><path d="M 2.4375 -14.859375 L 16 -14.859375 L 16 -11.9375 L 4.171875 -11.9375 L 4.171875 -2.921875 L 16 -2.921875 L 16 0 L 2.4375 0 C 1.945312 0 1.53125 -0.171875 1.1875 -0.515625 C 0.84375 -0.859375 0.671875 -1.273438 0.671875 -1.765625 L 0.671875 -13.09375 C 0.671875 -13.570312 0.84375 -13.984375 1.1875 -14.328125 C 1.53125 -14.679688 1.945312 -14.859375 2.4375 -14.859375 Z M 2.4375 -14.859375 "/></g></g></g><g fill-opacity="1"><g transform="translate(91.210323, 48.081926)"><g><path d="M 4.203125 -25.546875 L 26.015625 -25.546875 L 26.015625 -20.515625 L 7.171875 -20.515625 L 7.171875 -15.296875 L 24.484375 -15.296875 C 25.304688 -15.296875 26.015625 -14.992188 26.609375 -14.390625 C 27.210938 -13.785156 27.515625 -13.070312 27.515625 -12.25 L 27.515625 -3.03125 C 27.515625 -2.195312 27.210938 -1.484375 26.609375 -0.890625 C 26.015625 -0.296875 25.304688 0 24.484375 0 L 1.15625 0 L 1.15625 -5.03125 L 21.5 -5.03125 L 21.5 -10.265625 L 4.203125 -10.265625 C 3.367188 -10.265625 2.648438 -10.5625 2.046875 -11.15625 C 1.453125 -11.75 1.15625 -12.460938 1.15625 -13.296875 L 1.15625 -22.515625 C 1.15625 -23.335938 1.453125 -24.046875 2.046875 -24.640625 C 2.648438 -25.242188 3.367188 -25.546875 4.203125 -25.546875 Z M 4.203125 -25.546875 "/></g></g></g></svg>
			</div>
			<div class="loader-spinner">
				<div class="spinner-ring"></div>
				<div class="spinner-ring"></div>
				<div class="spinner-ring"></div>
			</div>
			<div class="loader-text">Loading...</div>
		</div>
	</div>
	{:then resolved} 
	<main class="flex-col">
		<slot />
	</main>
	{/await}
</div>

<div class="btm-nav">
  <button 
    onclick={()=>{handleNavigation('/')}} 
    class="{isActive('/') ? "active" : ""} {isNavigating ? 'nav-disabled' : ''}"
    disabled={isNavigating}
    aria-label="Home"
  >
    <i class="fi fi-rr-home"></i>
  </button>
  <button 
    onclick={()=>{handleNavigation('/qrcodeStorage')}} 
    class="{isActive('/qrcodeStorage') ? "active" : ""} {isNavigating ? 'nav-disabled' : ''}"
    disabled={isNavigating}
    aria-label="QR Code Storage"
  >
    <i class="fi fi-rr-database"></i>
  </button>
  <button 
    onclick={()=>{handleNavigation('/qrCodeScanner')}} 
    class="{isActive('/qrCodeScanner') ? "active" : ""} {isNavigating ? 'nav-disabled' : ''}"
    disabled={isNavigating}
    aria-label="QR Code Scanner"
  >
		<div class="bg-primary-base p-4 rounded-lg">
			<i class="fi fi-rr-camera flex dark:text-primary-heavy text-[#E0E0E0]"></i>
		</div>
  </button>
  <button 
    onclick={()=>{handleNavigation('/dataAnalisys')}} 
    class="{isActive('/dataAnalisys') ? "active" : ""} {isNavigating ? 'nav-disabled' : ''}"
    disabled={isNavigating}
    aria-label="Data Analysis"
  >
    <i class="fi fi-rr-chart-histogram"></i>
  </button>
  <button 
    onclick={()=>{handleNavigation('/settings')}} 
    class="{isActive('/settings') ? "active" : ""} {isNavigating ? 'nav-disabled' : ''}"
    disabled={isNavigating}
    aria-label="Settings"
  >
    <i class="fi fi-rr-settings-sliders"></i>
  </button>
</div>

<style lang="postcss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
	}
	main {
		min-height: 100vh;
		width: 100%;
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
		background: linear-gradient(135deg, var(--color-gradient-light) 0%, var(--color-gradient-heavy) 100%);
		z-index: 9999;
	}

	/* Ensure initial background respects theme */
	:global(html) {
		@apply bg-[#EAEAEC] dark:bg-primary-heavy;
	}

	:global(body) {
		@apply bg-[#EAEAEC] dark:bg-primary-heavy;
	}

	.loader-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}

	.loader-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		animation: logoFadeIn 0.8s ease-out;
	}

	.logo-svg {
		max-width: 300px;
		width: 100%;
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	.loader-spinner {
		position: relative;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spinner-ring {
		position: absolute;
		width: 100%;
		height: 100%;
		border: 4px solid transparent;
		border-top-color: white;
		border-radius: 50%;
		animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		opacity: 0.8;
	}

	.spinner-ring:nth-child(1) {
		width: 80px;
		height: 80px;
		animation-delay: 0s;
		border-top-color: white;
	}

	.spinner-ring:nth-child(2) {
		width: 60px;
		height: 60px;
		animation-delay: -0.4s;
		border-top-color: rgba(255, 255, 255, 0.7);
	}

	.spinner-ring:nth-child(3) {
		width: 40px;
		height: 40px;
		animation-delay: -0.8s;
		border-top-color: rgba(255, 255, 255, 0.5);
	}

	.loader-text {
		color: white;
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: 2px;
		text-transform: uppercase;
		animation: textPulse 1.5s ease-in-out infinite;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes logoFadeIn {
		0% {
			opacity: 0;
			transform: translateY(-20px) scale(0.9);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes textPulse {
		0%, 100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}

	.nav-disabled {
		opacity: 0.6;
		pointer-events: none;
		cursor: not-allowed;
	}

</style>
