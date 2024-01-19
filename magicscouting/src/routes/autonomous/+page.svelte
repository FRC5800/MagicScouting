<script>
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

    /**
	 * @param {string} key
	 */
    function getData(key){
		return sessionStorage.getItem(key);
	}
    /**
	 * @param {{ [x: string]: any }} payload
	 */
    function storeData(payload){
		for (var key in payload){
			sessionStorage.setItem(key, payload[key]);
		}
	}
    function onSubmit(){
        storeData({"AutoPoints": points});
		goto("/teleop");
    }

    let points = 0;
</script>
<section class="dark:bg-white">


    <button class="w-full btn submit_team_info" on:click={() => {points+=1}}>
		Increase Auto Points
	</button>

    <div class="center-container">
        <h1 class="btn">Auto Points: {points}<h1>
    </div>




	<div class="separator"></div>

	<hr>
	

    
    <button class="w-full btn submit_team_info" on:click={onSubmit}>
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