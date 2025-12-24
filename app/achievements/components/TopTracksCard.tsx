import Image from "next/image"

interface TrackDetails {
    track_name: string
    artist_name: string
    total_streams: number
    spotify_streams: number
    youtube_streams: number
    image_url: string
}

interface TopTracks {
    topTracks: Array<TrackDetails>
}

const TopTracksCard = ({topTracks}: TopTracks) => {
    if (!topTracks || topTracks.length === 0) {
        return null
    }
    
    return (
        <div className="w-full p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg mt-4">
            <h1 className="text-xl font-bold mb-5 text-gray-800">Your Top Tracks</h1>
            <div className="flex flex-col gap-3">
            {topTracks.map((track, index) => (
                <div key={index} className="border border-blue-200 bg-white/80 backdrop-blur rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full text-black font-bold text-sm flex-shrink-0">
                            {index + 1}
                        </div>
                        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <Image 
                                src={track.image_url} 
                                alt={track.track_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="font-semibold text-gray-800 truncate">{track.track_name}</h1>
                            <p className="text-sm text-gray-600 truncate">{track.artist_name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">{track.total_streams.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">streams</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default TopTracksCard