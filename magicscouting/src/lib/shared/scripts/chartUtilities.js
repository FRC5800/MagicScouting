// @ts-nocheck
import { TeamsDB } from "../stores/teamsData"
import { get } from "svelte/store"
import defaultLogo from "./defautLogo";

/**
 * An object representing the points awarded for various actions in the game.
 * 
 * Properties:
 * @property {number} autoROneScore - Points for auto Reef L1 Score.
 * @property {number} autoRTwoScore - Points for auto Reef L2 Score.
 * @property {number} autoRThreeScore - Points for auto Reef L3 Score.
 * @property {number} autoRFourScore - Points for auto Reef L4 Score.
 * @property {number} autoProcessorScore - Points for auto Processor Score.
 * @property {number} autoNetScore - Points for auto Net Score.
 * @property {number} isLeave - Points for leaving.
 * @property {number} teleopROneScore - Points for teleop Reef L1 Score.
 * @property {number} teleopRTwoScore - Points for teleop Reef L2 Score.
 * @property {number} teleopRThreeScore - Points for teleop Reef L3 Score.
 * @property {number} teleopRFourScore - Points for teleop Reef L4 Score.
 * @property {number} teleopProcessorScore - Points for teleop Processor Score.
 * @property {number} teleopNetScore - Points for teleop Net Score.
 * @property {Object} bargeStatus - An object representing the points for different barge statuses.
 * @property {number} bargeStatus.none - Points for no barge status.
 * @property {number} bargeStatus.park - Points for park barge status.
 * @property {number} bargeStatus.shallow - Points for shallow barge status.
 * @property {number} bargeStatus.deep - Points for deep barge status.
 */
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

/**
 * Checks if the provided data is a valid JSON string.
 *
 * @param {string} data - The data to be checked.
 * @returns {boolean} - Returns true if the data is a valid JSON string, otherwise false.
 */
function isJson(data){
	try{
		JSON.parse(data)
		return true
	}catch{
		return false
	}
}

/**
 * Calculates the average of the numbers in an array.
 *
 * @param {number[]} array - The array of numbers to calculate the average of.
 * @returns {number} The average of the numbers in the array.
 */
export function avgArray(array){
	let sum = 0
	array.forEach((e) => {
		sum += e
	})
	return sum/array.length
}

/**
 * Validates the structure of local storage data to ensure it is in the most updated format.
 *
 * This function checks if the provided local data is a valid JSON string and if it represents
 * a non-empty array. If any of these conditions are not met, the function returns false.
 *
 * @param {string} localData - The local storage data to be validated.
 * @returns {boolean} - Returns true if the local data is valid and in the correct format, otherwise false.
 */
export function validateLocalData(localData){
	if (!localData || !isJson( localData ) || ( isJson(localData) && ( !Array.isArray( JSON.parse(localData) ) || JSON.parse(localData).length == 0 ))){
		return false
	}
	return true

}

/**
 * Retorna o logotipo padrão.
 *
 * @returns {string} O logotipo padrão.
 */
export function getDefaultLogo(){
	return defaultLogo
}

/**
 * Calculates the average of specified fields from the given data.
 *
 * @param {Object} data - The data object containing the fields to be averaged.
 * @param {Array<string>} fields - An array of field names to be averaged.
 * @param {boolean} [points=true] - Flag to indicate if the values should be converted to points.
 * @param {Function} [customHandler=(a) => a] - A custom handler function to process each field value.
 * @returns {number} - The average value of the specified fields, rounded to one decimal place.
 */
export function getAverageDBvalues(data, fields, points=true, avg=true, customHandler=(a)=>{return a}){
	let total = 0;

	fields.forEach((field) => {
		total += parseFloat(customHandler(handleGetActionAttributes(data, field, points, avg)))
	})

	return Math.round(total*10)/10
}

/**
 * Retrieves scouting data for a specific team from the TeamsDB.
 *
 * @param {string} team - The name or identifier of the team to retrieve data for.
 * @returns {Array<Object>} An array of objects containing the scouting data for the specified team.
 */
export function getTeamScoutingData(team){
	let teamData = get(TeamsDB).filter((entry) => {
		return entry["team"] == team
	})
	return teamData
}

/**
 * Retorna uma lista ordenada com as equipes, da maior média de pontuação para a pior.
 *
 * @param {Array} allData - Array contendo os dados de todas as partidas.
 * @returns {Array} teams - Lista de equipes ordenadas pela média de pontuação.
 */
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

/**
 * Calculates the average performance of teams based on their scouting data.
 *
 * @param {Array} teams - An array of team identifiers.
 * @returns {Array} chartData - An array of objects containing the average performance data for each team.
 * Each object has the following properties:
 *   - {string} group - The category of performance (e.g., avgAutoPoints, avgTeleopCoralPoints, etc.).
 *   - {string} key - The team identifier.
 *   - {number} value - The average points for the specified category.
 */
export function averageTeamPerformance(teams){
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

/**
 * Extracts an array of values for a specific parameter from the provided data.
 * If the parameter is 'bargeStatus', it converts the values to points.
 * 
 * @param {Array} data - The array of match data objects.
 * @param {string} param - The parameter to extract from each match data object.
 * @param {boolean} [bargePoints=false] - Whether to convert 'bargeStatus' values to points.
 * @returns {Array} - An array of extracted values or points.
 */
export function getParameterArray(data, param, bargePoints=false){
	
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

/**
 * A generic function to retrieve a field or the average of a field from the data,
 * which can be converted to points or returned as a direct value. It also includes
 * automatic handling of the "bargeStatus" parameter.
 *
 * @param {Array} data - The array of match data objects.
 * @param {string} field - The field to retrieve or calculate the average for.
 * @param {boolean} [points=true] - Whether to convert the field value to points.
 * @param {boolean} [avg=true] - Whether to calculate the average of the field.
 * @returns {number} - The total value or average of the field, optionally converted to points.
 */
function handleGetActionAttributes(data, field, points = true, avg = true){
	let total;

	if (avg){
		if (field == "bargeStatus"){
			total = avgArray(getParameterArray(data, field, true))
		}else{
			total = avgArray(getParameterArray(data, field).slice().map(parseFloat)) * (points ? gamePointsByAction[field] : 1)
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

/**
 * Parses a cycle string and calculates the average of the numbers.
 *
 * @param {string} data - The cycle string containing numbers separated by "; ".
 * @returns {number} The average of the numbers in the cycle string. Returns 0 if the input string is empty.
 */
export function parseCycleString(data){
	if (data == "") {return 0}
	data = data.toString().replaceAll(",", ".").split(";").filter((e) => {
		return !isNaN(parseFloat(e))
	})
	console.log(data.map(parseFloat))
	return avgArray(data.map(parseFloat))
}

/**
 * Calculates the average cycle data from the provided data and fields.
 *
 * @param {Array} data - The dataset containing cycle information.
 * @param {Array<string>} fields - The fields to consider for calculating the average cycle time.
 * @returns {number} The average cycle time, rounded to one decimal place.
 */
export function getAverageCycleData(data, fields){
	let CycleTimes = ""
	fields.forEach((field) => {
		getParameterArray(data, field, false).forEach((el) => {
			CycleTimes += el + ";"
		})
	})

	CycleTimes = parseCycleString(CycleTimes)

	let cycleAverage = isNaN(CycleTimes) ? 0 : CycleTimes
	
	return Math.round(cycleAverage*10)/10
}

/**
 * Fetches data for a given team from the StatBotics API.
 *
 * @param {string} team - The team identifier.
 * @returns {Promise<Object>} A promise that resolves to an object containing the team's winrate and EPA.
 * @property {string} team - The team identifier.
 * @property {number} winrate - The winrate of the team.
 * @property {number} epa - The current normalized EPA of the team.
 */
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

/**
 * Fetches data and media for a specified team from The Blue Alliance API.
 *
 * @param {number} team - The team number to fetch data for.
 * @returns {Promise<Object>} An object containing the team's logo, name, and team number.
 * @property {string} logo - The team's logo as a base64 encoded image or a default logo.
 * @property {string} name - The nickname of the team.
 * @property {number} team - The team number.
 */
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
		logo: image.length > 0 ? ("data:image/png;base64," + image[0].details.base64Image) : getDefaultLogo(),
		name: requestData.nickname,
		team: team
	}
}

/**
 * Sets up bar chart data by match.
 *
 * @param {Array} data - The array of match data.
 * @param {Object} groups - The groups configuration object.
 * @param {Function} [customHandler=(a)=>{return a}] - A custom handler function to process the data.
 * @returns {Array} The formatted chart data.
 */
export function setupBarChartDataByMatch(data, groups, customHandler=(a)=>{return a}){
	let chartData = [];
	data.forEach((match) => {
	
		Object.keys(groups).forEach((group) => {
	
			let points = 0;
			groups[group].fields.forEach((field) => {
				points += handleGetActionAttributes(match, field, groups[group].showPoints, false)
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
	return chartData
}

/**
 * Sets up the data for bar charts based on the provided data and chart reference.
 *
 * @param {Object} data - The data to be used for setting up the bar charts.
 * @param {Object} chartReference - An object that maps chart groups to their respective data patterns.
 * @param {boolean} [showPoints=false] - A flag to indicate whether to show points on the chart (currently unused).
 * @param {Array<string>} [namePatterns=["Score", "Miss"]] - An array of name patterns to be used for grouping the data.
 * @returns {Array<Object>} An array of objects representing the bar chart data.
 */
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

/**
 * Sets up data for simple charts based on the provided data and chart reference.
 * This function supports different chart types and can be customized for game pieces (GP).
 *
 * @param {Object} data - The data to be used for setting up the chart.
 * @param {Object} chartReference - The reference object that maps labels to data entries.
 * @param {string} [chartType="donut"] - The type of chart to be created. Supported types are "donut" and "radar".
 * @param {boolean} [GP=false] - A flag to determine if the chart is for game pieces (GP).
 * @returns {Array} An array of objects representing the chart data.
 */
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

export function getBargeByType(data, type){
	if (!data){return []}

	let qty = 0;
	getParameterArray(data, "bargeStatus").forEach((e) => {
		if (e == type){
			qty += 1;
		}
	})
	return qty;
}

/**
 * Generates data for a chart that contains labels for different modes, such as barge status or robot function in a match.
 * Returns the information per match.
 *
 * @param {Object} data - The data source containing match information.
 * @param {string} field - The field in the data to be analyzed.
 * @param {Object} chartReference - An object mapping mode labels to their corresponding chart group names.
 * @returns {Array<Object>} An array of objects representing the chart data, where each object contains a "group" and a "value".
 */
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

//ALLIANCE CHARTS

// {
// 	"Auto": {"fields": autoPoints, "teams": ["5800", "1156", "1772"]},
// 	"Teleop": {"fields": TeleopPoints, "teams": ["5800", "1156", "1772"]}
// }

// {
// 	"1156": {"fields": allPoints, "teams": ["1156"]},
// 	"5800": {"fields": allPoints, "teams": ["5800"]}
// }


export function setupAllianceChartData(chartReference){
	let chartData = []

	console.log(chartReference)

	Object.keys(chartReference).forEach((group) => {
		let points = 0;
	
		chartReference[group].teams.forEach((team) => {
			points += getAverageDBvalues(getTeamScoutingData(team), chartReference[group].fields, true)
		})
		
		let bar = {
			"group": group,
			"key": chartReference[group].teams.length == 1 ? chartReference[group].teams[0] : group,
			"value": points
		}
		chartData.push(bar)
	})

	return chartData


}
