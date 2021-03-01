import { ExifTool } from 'exiftool-vendored'
const exiftool = new ExifTool({ taskTimeoutMillis: 5000 })
import { DateTime } from 'luxon'
import fs from 'fs'
import stringHash from 'string-hash'
import { TagType } from '../types/tag.type'

function writeAacTags(filePath: string, newTags: any) {
	exiftool.write(filePath, {
		//@ts-expect-error
		Album: 'New Album',
		AlbumArtist: 'New Album Artist',
		Artist: 'New Artist',
		Composer: 'New Composer',
		ContentCreateDate: new Date(),
		Genre: 'New Genre',
		Title: 'New Title',
		TrackNumber: 258,
		RatingPercent: 95,
		Comment: 'New Comment'
	})
	// let time = DateTime.fromISO('1999-01-01T01:01').toFormat('yyyy:mm:dd HH:MM:ss')
}

export function getAacTags(filePath: string): Promise<TagType> {
	return new Promise((resolve, reject) => {
		exiftool.read(filePath).then((tags) => {
			// console.log(tags)
			let fileStats = fs.statSync(filePath)
			resolve({
				ID: stringHash(filePath),
				//@ts-expect-error
				Album: tags['Album'],
				//@ts-expect-error
				AlbumArtist: tags['AlbumArtist'],
				Artist: tags['Artist'],
				//@ts-expect-error
				Composer: tags['Composer'],
				//@ts-expect-error
				Date: tags['ContentCreateDate'],
				//@ts-expect-error
				Genre: tags['Genre'],
				//@ts-expect-error
				DiskNumber: tags['DiskNumber'],
				Title: tags['Title'],
				//@ts-expect-error
				Track: getTrack(tags['TrackNumber'], tags['Track']),
				Rating: tags['RatingPercent'],
				//@ts-expect-error
				// Year: DateTime.fromISO(tags['ContentCreateDate']['rawValue']).toFormat('YYYY'),
				Year: tags['ContentCreateDate'],
				Comment: tags['Comment'],
				SourceFile: tags['SourceFile'],
				Extension: tags['FileTypeExtension'],
				Size: fileStats.size,
				Duration: tags['Duration'],
				SampleRate: tags['AudioSampleRate'],
				LastModified: fileStats.mtimeMs,
				BitRate: tags['AvgBitrate'],
				BitDepth: tags['AudioBitsPerSample']
			})
		})
	})
}

function getDate(){

}

function getTrack(...trackValues: [string | number]) {
	let numberedTrackFound = trackValues.find((i) => typeof i === 'number')

	if (numberedTrackFound) {
		return numberedTrackFound
	}

	for (let value of trackValues) {
		if (typeof value === 'string') {
			let splitTrack = Number(value.split(' ')[0])

			if (!isNaN(splitTrack)) {
				return splitTrack
			}
		}
	}
}