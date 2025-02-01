// @ts-nocheck
import { TeamsDB } from "../stores/teamsData"
import { get } from "svelte/store"

let gamePointsByAction = {
	"autoROneScore": 3,
	"autoRTwoScore": 4,
	"autoRThreeScore": 6,
	"autoRFourScore": 7,
	"autoProcessorScore": 6, 
	"autoNetScore": 4, 
	"isLeave": 3,
	"teleopROneScore": 2,
	"teleopRTwoScore": 3,
	"teleopRThreeScore": 4,
	"teleopRFourScore": 5,
	"teleopProcessorScore": 6,
	"teleopNetScore": 4,
	"bargeStatus": {"none": 0, "park": 2, "shallow": 6, "deep": 12},
}; 


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

export function getParameterArray(data, param, bargePoints=false){
	// Pegar um campo de varias partidas
	
	let entryArray = []
	data.forEach((e) => {
		if (bargePoints){
			entryArray.push(gamePointsByAction.bargeStatus[e[param]])
		}else{
			entryArray.push(e[param])
			
		}
	})
	return entryArray
}

export async function getStatBoticsData(team){
	let requestData = await fetch(`https://api.statbotics.io/v3/team/${team}`).then((r) => {
		return r.json()
	})

	return {
		team: team,
		winrate: requestData.record.season.winrate,
		epa: requestData.norm_epa.current
	}

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

export function setupBarChartsData(data, chartLabels, chartReference, namePatterns=["Score", "Miss"]){
	if (!data){return []}
	
	let chartData = []

	chartReference.forEach((e) => {
		namePatterns.forEach((pattern) => {
			let bar = {
				"key": chartLabels[chartReference.indexOf(e)],
				"group": pattern,
				"value": avgArray(getParameterArray(data, e+pattern))
			}
			chartData.push(bar)
		})
		
	})
		
	return chartData
}



export function setupSimpleChartsData(data, chartReference, chartType="donut"){
	if (!data){return []}
	
	let chartData = []

	Object.keys(chartReference).forEach((gpEnties) => {
		let label = gpEnties

		gpEnties = chartReference[gpEnties]
		
		let points = 0;
		
		gpEnties.forEach((e) => {
			if (e == "bargeStatus"){
				points += avgArray(getParameterArray(data, e, true))
			}else{
				points += avgArray(getParameterArray(data, e)) * gamePointsByAction[e]  
			}
		})

		let bar;
		if (chartType == "donut"){
			bar = {
				"group": label,
				"value": points
			}
		}else if(chartType == "radar"){
			bar = {
				"product": "Stats",
				"feature": label,
				"score": points
			}
		}
		chartData.push(bar)	
	})
		
	console.log(chartData)
	return chartData
}

export function getTeamScoutingData(team){
	let teamData = get(TeamsDB).filter((entry) => {
		return entry["team"] == team
	})
	return teamData
}