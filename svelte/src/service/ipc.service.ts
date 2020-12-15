const { ipcRenderer } = require('electron')

export function getOrder(index: number): Promise<string[]> {
	return new Promise((resolve, reject) => {
		ipcRenderer.invoke('get-order', index).then((result) => {
			//TODO Gets called too many times
			resolve(result)
		})
	})
}

export function getConfig() {
	return new Promise((resolve, reject) => {
		ipcRenderer.invoke('get-config').then((result) => {
			resolve(result)
		})
	})
}

export function saveConfig(newConfig: object) {
	return new Promise((resolve, reject) => {
		ipcRenderer.invoke('save-config', newConfig).then((result) => {
			resolve(result)
		})
	})
}

export function getAlbums() {
	return new Promise((resolve, reject) => {
		ipcRenderer.invoke('get-albums').then((result) => {
			console.log(result)
			// When the results arrive, recursive call to wait for the eventual new filtering.
			resolve(result)
			getAlbums()
		})
	})
}
