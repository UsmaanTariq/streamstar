import Image from 'next/image'
import DeleteButton from './DeleteButton'

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
    onDelete?: (user_track_id: number) => void
}

const Track = ({ track_name, artist_name, album_name, popularity, streams, release_date, image_url, user_track_id, youtube_streams, onDelete }: TrackProps) => {
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
                    <h1 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                        {track_name}
                    </h1>
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
                        {/* <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                        </div> */}
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Spotify Streams</p>
                            <p className="text-sm font-semibold text-gray-800">{formattedStreams}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div> */}
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">YouTube Streams</p>
                            <p className="text-sm font-semibold text-gray-800">{formattedYoutubeStreams}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div> */}
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
            </div>
        </div>
    )
}

export default Track