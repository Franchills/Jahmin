<script lang="ts">
	import { onMount } from 'svelte'

	let volume: number = 0
	export let player: HTMLAudioElement

	let isShiftKeyDown = false

	let isPlayerLoaded = false

	let saveVolumeDebounce: NodeJS.Timeout = undefined

	$: {
		if (player && isPlayerLoaded === false) {
			isPlayerLoaded = true
			loadLocalStorageVolume()
		}
	}

	$: {
		volume
		if (isPlayerLoaded === true) {
			volumeChange()
		}
	}

	onMount(() => {})

	function volumeChange() {
		player.volume = volume / 100
		let volumeBarWidth = document.querySelector('volume-bar').clientWidth
		let volumeThumbWidth = document.querySelector('volume-bar volume-thumb').clientWidth
		document.documentElement.style.setProperty('--volume-level', `${(volumeBarWidth - volumeThumbWidth) * (volume / 100)}px`)

		clearTimeout(saveVolumeDebounce)

		saveVolumeDebounce = setTimeout(() => {
			localStorage.setItem('volume', String(volume))
		}, 1000)
	}

	function loadLocalStorageVolume() {
		volume = Number(localStorage.getItem('volume') || NaN)

		if (volume === undefined || isNaN(volume) || volume > 100) {
			volume = 25
			localStorage.setItem('volume', String(volume))
		}

		player.volume = volume / 100

		volumeChange()
	}
</script>

<volume-bar>
	<input
		on:keydown={(evt) => {
			if (evt['key'] === 'Shift') isShiftKeyDown = true
		}}
		on:keyup={() => (isShiftKeyDown = false)}
		type="range"
		min="0"
		max="100"
		step={isShiftKeyDown ? '5' : '1'}
		bind:value={volume}
	/>
	<background />
	<volume-thumb>{Math.round(volume)}</volume-thumb>
</volume-bar>

<style>
	volume-bar {
		display: grid;
		grid-template-columns: 100%;

		justify-content: center;
		align-items: center;
		height: 32px;
	}

	input {
		display: block;
		grid-row: 1;
		grid-column: 1;
		height: 100%;
		z-index: 1;
		opacity: 0;
	}

	input:active {
		cursor: none;
	}

	volume-thumb {
		grid-row: 1;
		grid-column: 1;
		transform: translateX(var(--volume-level)); /*  Volume Visual Control */
		display: flex;
		align-items: center;
		justify-content: center;

		height: 32px;
		width: 32px;
		background-color: #fff;
		border-radius: 25px;
		mix-blend-mode: hard-light;

		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
		color: #767676;

		font-variation-settings: 'wght' 700;
	}

	background {
		grid-row: 1;
		grid-column: 1;
		top: 0;
		left: 0;
		height: 16px;
		background: linear-gradient(to right, var(--high-color), var(--low-color));
		border-radius: 25px;
		box-shadow: inset 0 0 0 2px #fff, inset 0 0 5px 0 rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
</style>
