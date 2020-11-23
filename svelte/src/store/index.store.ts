import { Writable, writable } from 'svelte/store'

export let songIndex: Writable<string[]> = writable([])

type FilterType = {
	userSelection?: string
	filter: string
	data?: any[]
}

export let versioning: Writable<number> = writable(Date.now())

export let allSongFilters: Writable<FilterType[]> = writable([])

// 'Genre', 'AlbumArtist', 'Album'
export let valuesToGroup: Writable<string[]> = writable([])

// Value choosen by the user to filter out the specified tag from the song index.
export let valuesToFilter: Writable<string[]> = writable([])
