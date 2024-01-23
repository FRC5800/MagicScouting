<script>
    import QRCode from 'qrcode'
	import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n'
    
    let appData = '[1,2,3,4,5,6,7,8,9]'

    var src = '';

    function updateQr() {
        QRCode.toDataURL(appData, { errorCorrectionLevel: 'L' }, function (err, url) {
        src = url;
    })
    }

    let showQrCode = false;

    onMount(() => {
        QRCode.toDataURL(appData, { errorCorrectionLevel: 'L' }, function (err, url) {
        src = url;
    })
    })
</script>

<textarea on:input={updateQr} bind:value={appData} class="box-border resize-none p-4 rounded-lg w-[70vw] text-[#EAEAEC] bg-grey-heavy mt-4"></textarea>

<span class="mt-4">(Offline)</span>
<button on:click={() => {showQrCode = !showQrCode}} class="transition-none {showQrCode ? 'dark:text-white rounded-b-none dark:border-0 dark:bg-buttons' : ''} min-w-[50vw] rounded-3xl border-0 m-0 w-fit btn">
    {$_('qrcode.qrcode_button')}
</button>

    {#if (showQrCode)}
        <div class="qrCode-container min-w-[50vw] flex flex-row justify-center bg-white w-fit rounded-b-3xl">
            <img {src} alt="A Qr Code">
        </div>
    {/if}

<i role="button" tabindex="0" on:keydown={(e) => {showQrCode = e.key == "Enter" ? !showQrCode : showQrCode}} on:click={() => {showQrCode = !showQrCode}} class="fa-solid fa-chevron-down {showQrCode ? 'transform rotate-180' : '' }"></i>

<span class="m-4">{$_('qrcode.or')}</span>

<span >(Online)</span>
<button class="min-w-[50vw] rounded-3xl m-0 w-fit btn">{$_('qrcode.upload_button')}</button>

<div class="w-[30vw] separator my-8"></div>

<button class="min-w-[50vw] rounded-3xl m-0 w-fit btn">{$_('qrcode.finish_button')}</button>

<style>
    :global(.qrCode-container  > img){
        height: 30vh;
        width: auto;
    }
</style>