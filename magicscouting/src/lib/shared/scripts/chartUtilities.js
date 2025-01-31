// @ts-nocheck
import { TeamsDB } from "../stores/teamsData"
import { get } from "svelte/store"

export function formatToChart(entry){
	let chartData = []
	
	for (let i = 0; i < Object.keys(entry).length; i++){
		let key = Object.keys(entry)[i]
		let value = Object.values(entry)[i]
		chartData.push({group: key, value: value})
	}

	return chartData
}

export function avgArray(array){
	let sum = 0
	array.forEach((e) => {
		sum += e
	})
	return sum/array.length
}

export function getEntryArray(data, param){
	let entryArray = []
	data.forEach((e) => {
		entryArray.push(e[param])
	})
	return entryArray
}

export async function getTBAData(team){
	let requestData = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/simple`,
		{
			method: "GET",
			headers: {
				"X-TBA-Auth-Key": "ua8GRX5X4m3IKgFxkruldDLonsaOlAc8GTlK0DLdIsUUYkTfda8KaHaKbaUEsDTq"
			}
		}
	).then((r) => {
		return r.json()
	})
	let image = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/media/2025`,
		{
			method: "GET",
			headers: {
				"X-TBA-Auth-Key": "ua8GRX5X4m3IKgFxkruldDLonsaOlAc8GTlK0DLdIsUUYkTfda8KaHaKbaUEsDTq"
			}
		}
	).then((r) => {
		return r.json()
	})
	return {
		logo: "data:image/png;base64," + image[0].details.base64Image,
		name: requestData.nickname,
		team: team
	}
}

export function setupChartsDataScore(data, chartLabels, chartReference, namePatterns=["Score", "Miss"]){
	if (!data){return []}
	
	let chartData = []

	chartReference.forEach((e) => {
		namePatterns.forEach((pattern) => {
			let bar = {
				"key": chartLabels[chartReference.indexOf(e)],
				"group": pattern,
				"value": avgArray(getEntryArray(data, e+pattern))
			}
			chartData.push(bar)
		})
		
	})
		

	let teleopRFourScore = getEntryArray(data, "teleopRFourScore")
	
	// console.log(chartData)
	return chartData
}

export function getTeamScoutingData(team){
	let teamData = get(TeamsDB).filter((entry) => {
		return entry["team"] == team
	})
	return teamData
}