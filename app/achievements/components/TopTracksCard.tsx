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
        <div className="w-full bg-white rounded-2xl shadow-xl p-6 border border-neutral-200">
            <h1 className="text-2xl font-black text-neutral-900 mb-6">Top Tracks</h1>
            <div className="flex flex-col gap-3">
            {topTracks.map((track, index) => (
                <div key={index} className="bg-neutral-50 rounded-xl p-4 hover:bg-neutral-100 transition-colors border border-neutral-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 text-white font-black text-lg flex-shrink-0">
                            {index + 1}
                        </div>
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <Image 
                                src={track.image_url} 
                                alt={track.track_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="font-bold text-neutral-900 truncate text-lg">{track.track_name}</h1>
                            <p className="text-sm text-neutral-600 truncate">{track.artist_name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-neutral-900">{track.total_streams.toLocaleString()}</p>
                            <p className="text-xs text-neutral-500 font-medium">streams</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default TopTracksCard