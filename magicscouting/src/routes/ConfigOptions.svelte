<script>
// @ts-nocheck

	import SelectInput from '$lib/components/SelectInput.svelte';
	import theme from '$lib/shared/stores/darkMode.js';
	import colorTheme from '$lib/shared/stores/colorTheme.js';
	import { locale, _ } from 'svelte-i18n';

	let linguagens = [
		{ id: '1', content: 'English', value: 'en' },
		{ id: '2', content: 'Português (Brasil)', value: 'pt-BR' },
		{ id: '3', content: 'Español', value: 'es' }
	];

	$: themes = [
		{ id: '1', content: $_('home_page.settings.option_theme.option_light'), value: 'light' },
		{ id: '2', content: $_('home_page.settings.option_theme.option_dark'), value: 'dark' },
		{ id: '3', content: $_('home_page.settings.option_theme.option_system'), value: 'system' }
	];

	let colors = [
		{ id: '1', content: 'blue', border: 'border-[#35CEE8]', background: 'bg-[#35CEE8]' },
		{ id: '2', content: 'purple', border: 'border-[#9235E8]', background: 'bg-[#9235E8]' },
		{ id: '3', content: 'red', border: 'border-[#E8281E]', background: 'bg-[#E8281E]' },
		{ id: '4', content: 'green', border: 'border-[#35E89A]', background: 'bg-[#35E89A]' },
		{ id: '5', content: 'pink', border: 'border-[#D92793]', background: 'bg-[#D92793]' }
	];

	let showMoreThemes = 'hidden';
	let showMoreLanguages = 'hidden';

	// @ts-ignore
	let selected_language;
	let inicialLanguage = $locale;
	$: console.log(inicialLanguage + ', ' + $locale);
	let inicialTheme = $theme;
	let selected_theme;
	let selected_color = $colorTheme;
	$: if(selected_color != $colorTheme) {
		$colorTheme = selected_color;
		document.querySelector("html")?.setAttribute("theme", $colorTheme);
	}
	$: $colorTheme = selected_color;

	function handle_theme_selection() {
		$theme = selected_theme['value'];

		let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		let htmlTagClasses = document.querySelector('html').classList;
		if ($theme == 'dark') {
			htmlTagClasses.remove('light');
			htmlTagClasses.add('dark');
			document.querySelector('html')?.setAttribute('data-theme', 'dark');
		} else if ($theme == 'light') {
			htmlTagClasses.remove('dark');
			htmlTagClasses.add('light');
			document.querySelector('html')?.setAttribute('data-theme', 'light');
		} else {
			htmlTagClasses.remove('dark');
			htmlTagClasses.remove('light');
			htmlTagClasses.add(systemTheme);
			document.querySelector('html')?.setAttribute('data-theme', systemTheme);
		}
	}

	function handle_language_selection() {
		$locale = selected_language['value'];
		window.localStorage.setItem('language', $locale);
	}
</script>

<h1 class="text-2xl">{$_('home_page.settings.title')}</h1>
<div class="separator" style="width: 50%;"></div>

<div
	class=" flex flex-col w-[100%] items-center px-[5vw] sm:px-[5vw] font-defaultText font-bold text-[1.2rem]"
>
	<div class="py-2">{$_('home_page.settings.option_language')}</div>
	<SelectInput
		options={linguagens}
		inicialOption={inicialLanguage}
		bind:SelectedOption={selected_language}
		showMore={showMoreLanguages}
		componentId={'language'}
		on:selection_updated={handle_language_selection}
	/>
	<div class="py-2">{$_('home_page.settings.option_theme.title')}</div>
	<SelectInput
		options={themes}
		inicialOption={inicialTheme}
		bind:SelectedOption={selected_theme}
		showMore={showMoreThemes}
		componentId={'theme'}
		on:selection_updated={handle_theme_selection}
	/>
</div>
<div class="py-2 font-defaultText font-bold text-[1.2rem]">{$_('home_page.settings.option_color')}</div>
<div
	class="flex flex-row justify-around flex-wrap w-full p-1 rounded-2xl border-[#666666] border-[3px]"
	id="colorContainer"
>
	{#each colors as color}
		<div class="w-[15%] h-9 border-[4px] {color.border} p-1 rounded-[50%]">
			<label
				for={color.content}
				class="{color.content == selected_color
					? color.background
					: ''} w-full h-full rounded-2xl block"
			>
				<input
					value={color.content}
					name="colors"
					bind:group={selected_color}
					id={color.content}
					type="radio"
					class="appearance-none"
				/>
			</label>
		</div>
	{/each}
</div>

<style>
</style>