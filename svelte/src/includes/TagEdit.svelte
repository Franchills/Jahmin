<script lang="ts">
	import TagEditEditor from '../components/TagEdit-Editor.svelte'
	import TagEditSeparator from '../components/TagEdit-Separator.svelte'

	import type { SongType } from '../types/song.type'
	import type { TagDetailType } from '../types/tagDetails.type'

	import { selectedAlbumId, selectedSongsStore } from '../store/final.store'

	import { getAlbumIPC } from '../service/ipc.service'

	let isSelectedSongsFirstAssign = true

	let songList: SongType[] = []

	let tagGroupDetail: TagDetailType = undefined

	let newTags: TagDetailType = {
		Album: undefined,
		AlbumArtist: undefined,
		Artist: undefined,
		Comment: undefined,
		Composer: undefined,
		Date_Year: undefined,
		Date_Month: undefined,
		Date_Day: undefined,
		Genre: undefined,
		Rating: undefined,
		Title: undefined,
		Track: undefined
	}

	$: {
		newTags
		cleanObject()
	}

	$: {
		$selectedAlbumId
		$selectedSongsStore

		if (isSelectedSongsFirstAssign === true) {
			isSelectedSongsFirstAssign = false
		} else {
			checkSongs()
		}
	}

	function cleanObject() {
		let tagsToUpdate = {}

		for (let tag in tagGroupDetail) {
			if (tagGroupDetail[tag] !== newTags[tag]) {
				tagsToUpdate[tag] = newTags[tag]
			}
		}

		// console.log(tagsToUpdate)
	}

	let previousSongList: SongType[] = undefined

	// Check either Selected Songs (if any selected) or Selected Album (if no songs selected). Then, calls group songs
	function checkSongs() {
		getAlbumIPC($selectedAlbumId).then((result) => {
			// console.log(result)
			// If songs selected
			if ($selectedSongsStore.length > 0) {
				songList = result.Songs.filter((song) => $selectedSongsStore.includes(song.ID))

				// Check if song list changed.
				if (JSON.stringify(previousSongList) !== JSON.stringify(songList)) {
					groupSongs()
					previousSongList = [...songList]
				}
			} else {
				songList = result.Songs

				// Check if song list changed.
				if (JSON.stringify(previousSongList) !== JSON.stringify(songList)) {
					groupSongs()
					previousSongList = [...songList]
				}
			}
		})
	}

	function groupSongs() {
		let tagGroup: TagDetailType = {
			Album: undefined,
			AlbumArtist: undefined,
			Artist: undefined,
			Comment: undefined,
			Composer: undefined,
			Genre: undefined,
			Rating: undefined,
			Title: undefined,
			Track: undefined,
			Date_Year: undefined,
			Date_Month: undefined,
			Date_Day: undefined
		}

		// Goes through every song and checks every tag from tag group.
		for (let song of songList) {
			for (let tag in tagGroup) {
				// console.log(tagGroup[tag], song[tag], tagGroup[tag] !== song[tag])

				if (tagGroup[tag] === undefined) {
					tagGroup[tag] = song[tag]

					// If does not match previously set value.
				} else if (tagGroup[tag] !== song[tag]) {
					tagGroup[tag] = '(Multiple Values)'
				}
			}
		}

		// console.log(tagGroup)

		tagGroupDetail = Object.assign({}, tagGroup)
		newTags = Object.assign({}, tagGroupDetail)
	}
</script>

<tag-edit-svlt>
	<component-name>Tag Edit</component-name>

	<TagEditEditor tagName="Title" type="input" bind:value={newTags.Title} />
	<TagEditEditor tagName="Album" type="input" bind:value={newTags.Album} />
	<TagEditEditor tagName="Artist" type="textarea" bind:value={newTags.Artist} />
	<TagEditEditor tagName="Album Artist" type="textarea" bind:value={newTags.AlbumArtist} />
	<TagEditEditor tagName="Genre" type="input" bind:value={newTags.Genre} />
	<TagEditEditor tagName="Composer" type="input" bind:value={newTags.Composer} />
	<TagEditEditor tagName="Comment" type="textarea" bind:value={newTags.Comment} />

<!--
	<tag-edit-date>
		<edit-group>
			<input type="number" bind:value={newTags.Date.year} />
			<span>Year (4 Digits)</span>
		</edit-group>

		<edit-group>
			<input type="number" bind:value={newTags.Date.month} />
			<span>Month (2 Digits)</span>
		</edit-group>

		<edit-group>
			<input type="number" bind:value={newTags.Date.day} />
			<span>Day (2 Digits)</span>
		</edit-group>

		<edit-group>
			<input type="number" disabled />
			<span>Year</span>
		</edit-group>
	</tag-edit-date> -->
</tag-edit-svlt>

<style>
	tag-edit-svlt {
		grid-area: tag-edit-svlt;

		display: flex;
		flex-direction: column;

		background-color: rgba(0, 0, 0, 0.25);
	}

	tag-edit-date {
		width: 100%;
		display: grid;
		grid-template-columns: 4fr 1fr 1fr 3fr;
	}

	tag-edit-date edit-group input {
		width: 100%;
	}

	component-name {
		text-align: center;
		padding: 0.5rem;
		background-color: rgba(255, 255, 255, 0.05);
		margin-bottom: 0.5rem;
		/* font-size: .9rem; */
	}
</style>
