<script>
	// @ts-nocheck
	import { run } from 'svelte/legacy';

	import dataBase, { useDB } from '$lib/shared/stores/dataBase';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	import { carbonTheme } from '$lib/shared/stores/darkMode.js';

	import { DonutChart, RadarChart, LineChart, ComboChart } from '@carbon/charts-svelte';

	import { writable } from 'svelte/store';
	import { TeamsDB } from '$lib/shared/stores/teamsData';
	import { App } from '@capacitor/app';
	App.addListener('backButton', () => {
		goto('/dataAnalisys');
	});

	import { goto } from '$app/navigation';
	import teamAnalysisData from '$lib/shared/stores/teamAnalysisData';
	import {
		setupSimpleChartsData,
		getTeamScoutingData,
		getTBAData,
		getStatBoticsData,
		setupModeChartsData,
		getAverageDBvalues,
		setupBarChartDataByMatch,
		getDefaultLogo
	} from '$lib/shared/scripts/chartUtilities';
	import TeamSearchBar from '$lib/components/TeamSearchBar.svelte';
	import { allPoints } from '$lib/shared/stores/gameKeys.js';

	
	let data = $derived($TeamsDB);
	console.log(data);

	let teamSearch = $state('');

	let selectedTeam = $state('');

	let activeTab = $derived(Object.keys($teamAnalysisData)[0] ?? '');

	let autoCompleteTeams = $derived(writable([]));

	run(() => {
		console.log($teamAnalysisData);
	});

	let debounceTimeout;

	function handleTabClose(teamNumber) {
		delete $teamAnalysisData[teamNumber];
		$teamAnalysisData = $teamAnalysisData;
		activeTab = '';
		if (Object.keys($teamAnalysisData).length > 0) {
			activeTab = Object.keys($teamAnalysisData)[0];
		}
		console.log($teamAnalysisData);


	}
</script>

<main
	class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white mb-16"
>
	<div
		class="w-full flex flex-row gap-4 items-center justify-center pt-6 pb-6 bg-transparent sticky top-0 z-10 bg-opacity-50 rounded backdrop-blur-lg drop-shadow-lg"
	>
		<i
			onclick={() => {
				goto('/dataAnalisys');
			}}
			class="fi fi-rr-angle-left flex mx-6 btn bg-transparent border-none"
		></i>
		<h1 class="grow flex flex-row items-center text-2xl font-medium tracking-wide">
			{$_('dataAnalysis.teamAnalysis.title')}
		</h1>
	</div>

	<div class="w-full sm:w-[600px] flex gap-4 mb-4 px-6 flex-col items-start">
		<h2 class="text-xl font-medium tracking-wide">
			{$_('dataAnalysis.teamAnalysis.searchBar_text')}
		</h2>
		<TeamSearchBar {teamSearch} bind:selectedTeam bind:analysisData={$teamAnalysisData} />
	</div>
	<div class="w-full flex sm:w-[600px]">
		<div role="tablist" class="tabs tabs-lifted min-w-80:overflow-x-scroll">
			{#key $teamAnalysisData}
				{#each Object.keys($teamAnalysisData) as teamNumber}
					<span
						role="tab"
						class="tab {activeTab == teamNumber
							? 'tab-active'
							: ''} flex flex-row gap-2 justify-center items-center min-w-max"
					>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							onclick={() => {
								activeTab = teamNumber;
							}}>{teamNumber}</span
						>
						{#if activeTab == teamNumber}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<i
								onclick={() => {
									handleTabClose(teamNumber);
								}}
								class="fi fi-rr-cross-small flex"
							></i>
						{/if}
					</span>
				{/each}
			{/key}
		</div>
	</div>

	{#if Object.keys($teamAnalysisData).length != 0 && activeTab != ''}
		<section
			class="flex sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-6 flex-col justify-center items-center w-full bg-[#f0f0f0] dark:bg-base-200 px-6 pb-6 flex-wrap overflow-x-hidden"
		>
			<div class="flex max-w-[400px] flex-row gap-4 items-center justify-center mt-6">
				<img width="50px" src={$teamAnalysisData[activeTab].logo} alt="Team Logo" />
				<div class="flex flex-row gap-2">
					<div>{$teamAnalysisData[activeTab].teamNumber}</div>
					<div>{$teamAnalysisData[activeTab].nameNumber}</div>
				</div>
			</div>
			<div class="w-full flex max-w-[400px]">
				<div class=" w-full relative my-2 mx-6 grow">
					<div class="flex flex-row justify-around items-center gap-4">
						<div
							class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2"
						>
							<h3>{$_('dataAnalysis.teamAnalysis.team_epa')}</h3>
							<span class="text-primary-base text-xl">{$teamAnalysisData[activeTab].EPA}</span>
						</div>
						<div
							class="grow basis-0 p-4 rounded-md flex flex-col items-center justify-center gap-2"
						>
							<h3>{$_('dataAnalysis.teamAnalysis.team_winrate')}</h3>
							<span class="text-primary-base text-xl"
								>{Math.round($teamAnalysisData[activeTab].winrate * 100 * 10) / 10}%</span
							>
						</div>
					</div>
				</div>
			</div>

			{#if $teamAnalysisData[activeTab].rawData.length > 0}
				<div class="w-full flex mb-3 max-w-[400px]">
					<div class=" w-full relative my-2 mx-6 grow">
						<div class="grow basis-0 rounded-md flex flex-col items-center justify-center gap-2">
							<h3>{$_('dataAnalysis.teamAnalysis.average_points')}</h3>
							<span class="text-primary-base text-xl"
								>{getAverageDBvalues($teamAnalysisData[activeTab].rawData, allPoints, true)}</span
							>
						</div>
					</div>
				</div>

				<div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start sm:items-center">
					<h2 class="text-xl font-medium tracking-wide">
						{$_('dataAnalysis.teamAnalysis.analytics_subtitle')}
					</h2>

					<div class="w-full flex flex-col gap-2 max-w-[400px]">
						<button
							onclick={() => {
								goto(`/dataAnalisys/teamAnalisys/Teleop/${activeTab}`);
							}}
							class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light"
						>
							<i class="fi fi-rr-users-alt flex"></i>
							<span>{$_('dataAnalysis.teamAnalysis.teleop_analytics')}</span>
							<div class="flex items-center justify-end grow">
								<i class="fi fi-rr-angle-right flex"></i>
							</div>
						</button>
						<button
							onclick={() => {
								goto(`/dataAnalisys/teamAnalisys/Autonomous/${activeTab}`);
							}}
							class="btn btn-block flex flex-row justify-start gap-4 bg-primary-opac text-primary-light"
						>
							<i class="fi fi-rr-overview flex"></i>
							<span>{$_('dataAnalysis.teamAnalysis.auto_analytics')}</span>
							<div class="flex items-center justify-end grow">
								<i class="fi fi-rr-angle-right flex"></i>
							</div>
						</button>
					</div>
				</div>

				<div class="carousel carousel-center w-full max-w-fit">
					<div class="carousel-item">
						<DonutChart
							data={setupSimpleChartsData($teamAnalysisData[activeTab].rawData, {
								Auto: ['autoClimb', 'autoFuelNumber'],
								Teleop: ['teleopFuelNumber', 'teleopClimb']
							})}
							options={{
								theme: $carbonTheme,
								title: $_('dataAnalysis.teamAnalysis.points_by_period'),
								height: '300px',
								width: '300px',
								axes: {
									left: { mapsTo: 'value' },
									bottom: { mapsTo: 'group', scaleType: 'labels' }
								}
							}}
						/>
					</div>
				</div>

				<div class="divider w-full sm:hidden"></div>
				<div class="carousel carousel-center w-full max-w-fit">
					<div class="carousel-item">
						<DonutChart
							data={setupModeChartsData($teamAnalysisData[activeTab].rawData, 'robotFunction', {
								score: 'Scorer',
								defense: 'Defender',
								feed: 'Feeder'
							})}
							options={{
								theme: $carbonTheme,
								title: $_('dataAnalysis.teamAnalysis.team_function'),
								height: '300px',
								width: '300px',
								axes: {
									left: { mapsTo: 'value' },
									bottom: { mapsTo: 'group', scaleType: 'labels' }
								}
							}}
						/>
					</div>
					<div class="carousel-item">
						<DonutChart
							data={setupModeChartsData($teamAnalysisData[activeTab].rawData, 'teleopClimb', {
								none: 'None',
								L1: 'L1',
								L2: 'L2',
								L3: 'L3'
							})}
							options={{
								theme: $carbonTheme,
								title: 'Climb Profile',
								height: '300px',
								width: '300px',
								axes: {
									left: { mapsTo: 'value' },
									bottom: { mapsTo: 'group', scaleType: 'labels' }
								}
							}}
						/>
					</div>
				</div>

				<div class="divider w-full"></div>

				<ComboChart
					data={setupBarChartDataByMatch($teamAnalysisData[activeTab].rawData, {
						Score: { fields: allPoints, valueName: 'Points', showPoints: true },
						Fuel: {
							fields: ['autoFuelNumber', 'teleopFuelNumber'],
							valueName: 'Points',
							showPoints: true
						},
						Climb: { fields: ['autoClimb', 'teleopClimb'], valueName: 'Points', showPoints: true }
					})}
					options={{
						theme: $carbonTheme,
						title: $_('dataAnalysis.teamAnalysis.score_by_match'),
						height: '200px',
						width: '330px',
						comboChartTypes: [
							{
								type: 'grouped-bar',
								correspondingDatasets: ['Climb', 'Fuel']
							},
							{
								type: 'line',
								correspondingDatasets: ['Score']
							}
						],
						axes: {
							left: {
								title: 'Score',
								mapsTo: 'Points'
							},
							bottom: {
								scaleType: 'labels',
								title: 'Match',
								mapsTo: 'key'
							}
							// right: {
							//     title: "Game Pieces",
							//     scaleType: "linear",
							//     mapsTo: "Points",
							//     correspondingDatasets: [
							//         "Fuel",
							//         "Climb"
							//     ]
							// }
						}
					}}
				/>

				<div class="w-80 h-full flex-col flex mb-24">
					<div class="flex justify-between">
						<div class="flex w-full h-full ml-0">
							<p class="title cds--cc--title font-semibold">Resumo das observações</p>
						</div>

						<div class="w-50 h-full mr-0 gap-2 flex-row flex">
							<button type="button" class=" w-7 h-7 justify-center items-center flex" aria-haspopup="true" aria-label="View as txt">
								<svg
									w-4
									h-4
									focusable="false"
									fill="currentColor"
									preserveAspectRatio="xMidYMid meet"
									xmlns="http://www.w3.org/2000/svg"
									class=" "
									viewBox="0 0 32 32"
									aria-hidden="true"
									style="pointer-events: none; will-change: transform; width: 20px; height: 20px; "
								>
									<rect xmlns="http://www.w3.org/2000/svg" 
									x="4" 
									y="6" 
									width="22" 
									height="2"
									></rect><rect
										xmlns="http://www.w3.org/2000/svg"
										x="4"
										y="12"
										width="22"
										height="2"
									></rect><rect
										xmlns="http://www.w3.org/2000/svg"
										x="4"
										y="18"
										width="22"
										height="2"
									></rect><rect
										xmlns="http://www.w3.org/2000/svg"
										x="4"
										y="24"
										width="22"
										height="2"
									></rect>
								</svg>
							</button>
							<button class=" w-7 h-7 justify-center items-center flex " aria-label="See Fullscreen"
								><svg
									fill="currentColor"
									focusable="false"
									preserveAspectRatio="xMidYMid meet"
									xmlns="http://www.w3.org/2000/svg"
									class="cds--overflow-menu__icon cds--overflow-menu__icon"
									viewBox="0 0 32 32"
									aria-hidden="true"
									style="pointer-events: none; will-change: transform; width: 15px; height: 15px;"
								>
									<polygon
										xmlns="http://www.w3.org/2000/svg"
										points="21 2 21 4 26.59 4 17 13.58 18.41 15 28 5.41 28 11 30 11 30 2 21 2"
									></polygon><polygon
										xmlns="http://www.w3.org/2000/svg"
										points="15 18.42 13.59 17 4 26.59 4 21 2 21 2 30 11 30 11 28 5.41 28 15 18.42"
									></polygon>
								</svg></button
							>
							<button class=" w-7 h-7 justify-center items-center flex" aria-label="More Options"
							onclick={rodarIA}
								><svg
									fill="currentColor"
									focusable="false"
									preserveAspectRatio="xMidYMid meet"
									xmlns="http://www.w3.org/2000/svg"
									class="cds--overflow-menu__icon cds--overflow-menu__icon"
									viewBox="0 0 32 32"
									aria-hidden="true"
									style="pointer-events: none; will-change: transform; width: 20px; height: 20px;"
								>
									<circle xmlns="http://www.w3.org/2000/svg" cx="16" cy="8" r="2"></circle>
									<circle xmlns="http://www.w3.org/2000/svg" cx="16" cy="16" r="2"></circle>
									<circle xmlns="http://www.w3.org/2000/svg" cx="16" cy="24" r="2"></circle>
								</svg></button
							>
						</div>
					</div>

					<div
						class="layout-child layout-child-52858599378 spacer"
						style="height: 15px; width: 100%;"
					>
						<div
							class="cds--cc--spacer"
							role="presentation"
							width="100%"
							height="100%"
							opacity="0"
							style="width: 15px; height: 15px;"
						></div>
					</div>

					<div class="w-full h-full ml-0 bg-velvet-raven border-20 border">
						{($teamAnalysisData[activeTab].rawData, 'teamNumber', {
							
						})}


						<br />
						<br />
						<br />
						<br />
					</div>
				</div>
			{/if}
		</section>
	{/if}
</main>
