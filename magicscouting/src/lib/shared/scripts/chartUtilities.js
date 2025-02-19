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

export function getSortedTeams(allData){
	let teams = {}
	
	allData.forEach((match) => {
		teams[match.team] = 1
	})

	teams = Object.keys(teams)

	teams.sort((a,b) => {
		let aPoints = getAverageDBvalues(getTeamScoutingData(a),Object.keys(gamePointsByAction), true); 
		let bPoints = getAverageDBvalues(getTeamScoutingData(b),Object.keys(gamePointsByAction), true);

		return aPoints - bPoints
	})

	console.log(teams)
	return teams
}


export function avgTeamPerformance(teams){
	let chartData = []

	teams.forEach((team) => {

		let matches = getTeamScoutingData(team)
		let fields = {
			avgAutoPoints: [
				"autoROneScore",
				"autoRTwoScore", 
				"autoRThreeScore", 
				"autoRFourScore", 
				"autoProcessorScore", 
				"autoNetScore", 
				"isLeave"
			],
			avgTeleopCoralPoints: [
				"teleopROneScore",
				"teleopRTwoScore", 
				"teleopRThreeScore", 
				"teleopRFourScore", 
			],
			avgTeleopAlgaePoints: [
				"teleopProcessorScore", 
				"teleopNetScore"
			],
			avgEndGame: [
				"bargeStatus",
			]
		}
	
		Object.keys(fields).forEach((field) => {
			let points = getAverageDBvalues(matches, fields[field], true)
			chartData.push({
				group: field,
				key: team,
				value: points
			})
		})
	})
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

function handleGetActionAttributes(data, field, points = true, avg = true){
	let total;

	if (avg){
		if (field == "bargeStatus"){
			total = avgArray(getParameterArray(data, field, true))
		}else{
			total = avgArray(getParameterArray(data, field).slice().map((a) => parseFloat(a))) * (points ? gamePointsByAction[field] : 1)
		}
	}else{
		if (field == "bargeStatus"){
			total = gamePointsByAction.bargeStatus[data[field]]
		}else{
			total = points? (data[field] * gamePointsByAction[field]) : data[field]
		}
	}
	return total

}

export async function getStatBoticsData(team){
	let requestData = await fetch(`https://api.statbotics.io/v3/team/${team}`).then((r) => {
		return r.json()
	})

	return {
		team: team,
		winrate: requestData.record.winrate,
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

export function setupBarChartDataByMatch(data, groups, customHandler=(a)=>{return a}){
	let chartData = [];
	data.forEach((match) => {
	
		Object.keys(groups).forEach((group) => {
	
			let points = 0;
			groups[group].fields.forEach((field) => {
				console.log("this is match: " + match[field])
				points += customHandler(match[field])
				console.log("this is points: " + points)
			})
		

			let entry = {
				group: group,
				key: String(match.match),
			}
			
			entry[groups[group].valueName] = points

			chartData.push(entry)
		})
	})
	chartData.sort((a,b) => {return parseInt(a.key) - parseInt(b.key)})
	console.log(chartData)
	return chartData
}



export function setupBarChartsData(data, chartReference, showPoints=false, namePatterns=["Score", "Miss"]){
	if (!data){return []}
	
	let chartData = []

	Object.keys(chartReference).forEach((group) => {

		namePatterns.forEach((pattern) => {
			let bar = {
				"group": (pattern != "")? pattern : group,
				"key": group,
				"value": handleGetActionAttributes(data, chartReference[group]+pattern, false, true) 
			}
			chartData.push(bar)
		})
		
	})
	console.log(chartData)
	return chartData
}

export function getAverageDBvalues(data, fields, points=true, customHandler=(a)=>{return a}){
	let total = 0;

	fields.forEach((field) => {
		total += customHandler(handleGetActionAttributes(data, field, points, true))
	})

	return Math.round(total*10)/10
}
export function getAverageCycleData(data, fields){
	let total = 0;

	fields.forEach((field) => {
		total += avgArray(getParameterArray(data, field, false).map((CycleString) => {return parseCycleString(CycleString)}))
	})

	return Math.round((total/fields.length)*10)/10
}

export function setupSimpleChartsData(data, chartReference, chartType="donut", GP=false){
	if (!data){return []}
	
	let chartData = []

	Object.keys(chartReference).forEach((gpEntries) => {
		let label = gpEntries

		gpEntries = chartReference[gpEntries]
		
		let points = 0;
		
		gpEntries.forEach((e) => {
			points += handleGetActionAttributes(data, e, !GP, true)
		})

		let bar;
		if (chartType == "donut"){
			bar = {
				"group": label,
				"value": points
			}
		}else if(chartType == "radar"){
			bar = {
				"product": GP ? "GPs" : "Points",
				"group": label,
				"value": points
			}
		}
		chartData.push(bar)	
	})
		
	return chartData
}
export function parseCycleString(data){
	if (data == "") {return [0]}
	return avgArray(data.toString().split("; ").map(parseFloat))
}

export function setupModeChartsData(data, field, chartReference){
	if (!data){return []}
	
	let chartData = []

	Object.keys(chartReference).forEach((mode) => {		

		let qty = 0;
		getParameterArray(data, field).forEach((e) => {
			if (e == mode){
				qty += 1;
			}
		})
	
		let bar;
		
		bar = {
			"group": chartReference[mode],
			"value": qty
		}

		chartData.push(bar)
	})
		
	return chartData
}

export function getTeamScoutingData(team){
	let teamData = get(TeamsDB).filter((entry) => {
		return entry["team"] == team
	})
	return teamData
}