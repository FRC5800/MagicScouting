<script>
    import QRCode from "qrcode";
    import TrashCan from '$lib/components/TrashCan.svelte'
    import Modal from '../../routes/Modal.svelte';
	import entriesSync from "../shared/stores/toSyncData";

    export let payload = {"team":5800, "match":2};
    let src = ''

    let showQrCode = false
    async function send_to_sheets(payload){
        console.log("https://script.google.com/macros/s/AKfycbwuJXjCSjgDuAy4ncpD7NfNWKzuwsbuuTBWWfgvSBqS5jnr1iqz0UZ6pSfoxsJhMSgW/exec?" + new URLSearchParams(payload))
        try{
            // return self.fetch('https://corsproxy.io/?' + encodeURIComponent("https://script.google.com/macros/s/AKfycbwuJXjCSjgDuAy4ncpD7NfNWKzuwsbuuTBWWfgvSBqS5jnr1iqz0UZ6pSfoxsJhMSgW/exec?" + new URLSearchParams(payload)),{
            return self.fetch("https://script.google.com/macros/s/AKfycbwuJXjCSjgDuAy4ncpD7NfNWKzuwsbuuTBWWfgvSBqS5jnr1iqz0UZ6pSfoxsJhMSgW/exec?" + new URLSearchParams(payload),{
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },

            });
        }catch (e) {
            return false;
        }
    }   
    let buttonColor = ""
    let uploadDisabled = false;
    let uploadSuccess = 'undefined';
    let buttonText = "Upload";
    async function HandleUpload(){
        uploadDisabled = true;
        let animation = setInterval(() => {buttonText = buttonText == "Uploading..." ? "Uploading" : buttonText == "Uploading.." ? "Uploading..." : buttonText == "Uploading." ? "Uploading.." :buttonText == "Uploading" ? "Uploading." : "Uploading...";}, 200);
        let response = JSON.parse(await send_to_sheets(payload).then((r) => {return r.text()}));
        clearInterval(animation);
        console.log(response)
        if (response.result == "success"){
            buttonColor = "dark:bg-green-600 bg-green-600 ";
            HandleDelete();
            buttonText = "Uploaded";
            uploadSuccess = true;
        }else{
            buttonColor = "dark:bg-red-600 bg-red-600 ";
            buttonText = "Failed";
            uploadSuccess = false;
        }
    } 
    function HandleDelete(){                
        $entriesSync.splice($entriesSync.indexOf(payload), 1); 
        console.log($entriesSync);
    }

    function createQr() {
        QRCode.toDataURL(JSON.stringify(payload), { errorCorrectionLevel: 'L' }, function (err, url) {
        src = url;
    })
    }
    createQr()
</script>

<section class="flex flex-row w-full p-2 border-2">
    <div class="pr-3 border-r border-grey-heavy w-fit flex items-center justify-center">
        <i {src} alt="A Qr Code"  class="fa-solid fa-qrcode {uploadSuccess === true ? 'text-green-600' : uploadSuccess === false ? 'text-red-600' : ''} text-[100px]"></i>
    </div>

    <div class="flex flex-col items-start justify-between w-full ml-3 overflow-auto">
        
        <div class="flex flex-row justify-around w-full text-lg">
            <h1>Equipe: {payload.team}</h1>
            <h1>Partida: {payload.match}</h1>
        </div>
        
        <div class="w-full p-2 overflow-hidden overflow-x-auto rounded-lg bg-grey-heavy">{JSON.stringify(payload)}</div>

        <div class="flex flex-row items-center justify-around w-full">
            <button class="p-3 text-sm btn w-fit h-fit {buttonColor}" disabled={uploadDisabled}  on:click={HandleUpload}>{buttonText}</button>
            <button class="p-3 text-sm btn w-fit h-fit" on:click={() => {showQrCode = true}}>Escanear</button>
            <TrashCan scale={0.7} on:keydown={(e) => {if(e.key == "Enter") HandleDelete()}} on:click={() => {HandleDelete(); console.log('dawdawd'); $entriesSync = $entriesSync}}/>
        </div>
    </div>
</section>

<Modal bind:showModal={showQrCode}> 
    <h1 class="text-[1.8rem] font-semibold">QR Code</h1>
    <div class="flex items-center justify-center border-[1rem] rounded-lg border-blueTheme-500">
        <img class="w-[40vw] h-auto" {src} alt="">
    </div>
    <h1 class="text-[1.4rem] font-semibold">Scan Me</h1>
</Modal>

