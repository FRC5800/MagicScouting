<!-- <script>
    import {
  BarcodeScanner,
  BarcodeFormat,
} from "@capacitor-mlkit/barcode-scanning";

const startScan = async () => {
  // Hide all elements in the WebView
  document.querySelector("body")?.classList.add("barcode-scanning-active");

  // Add the `barcodeScanned` listener
  const listener = await BarcodeScanner.addListener(
    "barcodeScanned",
    async (result) => {
      // Print the found barcode to the console
      console.log(result.barcode);
    },
  );

  // Start the barcode scanner
  await BarcodeScanner.startScan();
};

const stopScan = async () => {
  // Make all elements in the WebView visible again
  document.querySelector("body")?.classList.add("barcode-scanning-active");

  // Remove all listeners
  await BarcodeScanner.removeAllListeners();

  // Stop the barcode scanner
  await BarcodeScanner.stopScan();
};

const requestPermissions = async () => {
  await BarcodeScanner.requestPermissions();
};
</script>

<button on:click={() => {startScan()}}>Mostrar QrcodeReader</button>

<style>
.barcode-scanning-active {
    background: transparent;
  visibility: hidden;
}


.barcode-scanning-modal {
  visibility: visible;
}
</style> -->