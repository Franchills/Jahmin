import { getAlbumColors } from '../service/getAlbumColors.fn'
import { getAlbumIPC } from '../service/ipc.service'
import { playback, playbackIndex, selectedAlbum } from '../store/player.store'
import type { SongType } from '../types/song.type'

export async function setNewPlayback(albumID: string, index: number) {
	let songs = await fetchAlbum(albumID)

	getAlbumColors(albumID)

	playback.set({
		AlbumID: albumID,
		SongList: songs
	})

	playbackIndex.set(undefined)
	playbackIndex.set({
		indexToPlay: index,
		playNow: true
	})
}

function fetchAlbum(albumID): Promise<SongType[]> {
	return new Promise(async (resolve, reject) => {
		let album = await getAlbumIPC(albumID)
		selectedAlbum.set(album)
		let songs = album['Songs'].sort((a, b) => a['Track'] - b['Track'])
		resolve(songs)
	})
}