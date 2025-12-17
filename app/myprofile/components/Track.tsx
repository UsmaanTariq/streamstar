import Image from 'next/image'
import DeleteButton from './DeleteButton'
import EditTrack from './EditTrack'

interface TrackProps {
    track_name: string
    artist_name: string
    created_at: string
    album_name: string
    popularity: number
    streams: number
    release_date: string
    image_url: string
    user_track_id: number
    youtube_streams: number
    role: string[]
    notes: string
    onDelete?: (user_track_id: number) => void
}
const Track = ({ track_name, artist_name, album_name, popularity, streams, release_date, image_url, user_track_id, youtube_streams, role, notes, onDelete }: TrackProps) => {
    const formattedStreams = streams?.toLocaleString() || '0'
    const formattedYoutubeStreams = youtube_streams?.toLocaleString() || '0'
    
    return (
        <div className="flex gap-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-100">
            {/* Album Art */}
            <div className="flex-shrink-0">
                <Image
                    src={image_url}
                    alt={track_name}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover shadow-sm"
                />
            </div>

            {/* Track Info */}
            <div className="flex flex-col flex-1 justify-between py-1">
                <div>
                    <div className='flex justify-between'>
                        <h1 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                            {track_name}
                        </h1>
                        <h2 className='text-gray-700 font-bold mb-1 line-clamp-1 mr-10'>{role.join(', ')}</h2>
                    </div>
                        <h2 className="text-base text-gray-600 mb-1">
                            {artist_name}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {album_name} • {release_date}
                        </p>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {/* Spotify Icon */}
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Spotify Streams</p>
                            <p className="text-sm font-semibold text-gray-800">{formattedStreams}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {/* YouTube Icon */}
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">YouTube Streams</p>
                            <p className="text-sm font-semibold text-gray-800">{formattedYoutubeStreams}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            {/* Fire Icon */}
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Popularity</p>
                            <p className="text-sm font-semibold text-gray-800">{popularity}/100</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-center gap-3'>
                {/* Delete Button */}
                <DeleteButton user_track_id={user_track_id} onDelete={onDelete}/>
                {/* Info Button */}
                <button className='p-2 rounded-lg hover:bg-blue-100 transition-colors'>
                    <svg className="w-5 h-5 text-blue-500 hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <EditTrack user_track_id={user_track_id}
                    artist={artist_name}
                    trackName={track_name}
                    albumName={album_name}
                    releaseDate={release_date}
                    role={role}
                    imageUrl={image_url}
                />
            </div>
        </div>
    )
}

export default Track