<script context="module">
	import Chart from 'chart.js/auto'
</script>

<script>
	export let config
	
	// @ts-ignore
	const handleChart = (element, config) => {
		let theChart = new Chart(element, config)
		
		return {
			// @ts-ignore
			update(config) {
				theChart.destroy()
				theChart = new Chart(element, config)
			},
			destroy() {
				theChart.destroy()
			}
		}
	}
</script>

<div>
	<canvas use:handleChart={config} />
</div>