<script>
	// @ts-ignore
	import { goto } from '$app/navigation';

	// @ts-ignore
	function send_to_sheets(payload){

		fetch("https://sheet.best/api/sheets/cea7cc7c-fe8e-4736-9976-d7585120344e", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
		.then((r) => r.json())
		.then((payload) => {console.log(payload)})
		.catch((error) => {console.log(error)});
		
	}
	// Add one line to the sheet
    /**
	 * @param {string} key
	 */
    function getData(key){
		return sessionStorage.getItem(key);
	}
    /**
	 * @param {{ [x: string]: any }} payload
	 */
    // @ts-ignore
    function storeData(payload){
		for (var key in payload){
			sessionStorage.setItem(key, payload[key]);
		}
	}
    function onSubmit(){
		console.log(JSON.stringify(formattedData));
		send_to_sheets(formattedData);
	}

	let formattedData = {};
    // @ts-ignore
    ["team_number", "match_number", "alliance", "team_position", "AutoPoints", "TeleOpPoints"].forEach((key)=>{formattedData[key] = getData(key)});
</script>

<section>




    <div class="center-container">
        <h1 class="btn">All data collected: {JSON.stringify(formattedData)}<h1>
    </div>

	<div class="separator"></div>

	<hr>
    
    <button class="btn submit_team_info w-full btn" on:click={onSubmit}>
		Continuar
	</button>


</section>

<style>
	.center-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
    }
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
	
	.separator {
		height: 2px;
        background: linear-gradient(to right, #5DE0E6, #004AAD) !important;
        margin: 15px 0;
		width: 80%;
	}

	hr{
		height: 5px;
		background-color: white;
	}

</style>