interface TotalsProps {
    totalStreams: number
    youtubeStreams: number
    spotifyStreams: number
}

const Totals = ({ totalStreams, youtubeStreams, spotifyStreams }: TotalsProps) => {
    return (
        <>
            <div className="flex gap-2 items-center justify-center">
                <div className="flex border-1 border-gray-600 p-4">
                    <h1>Total Streams: {totalStreams}</h1>
                </div>
                <div className="flex border-1 border-gray-600 p-4">
                    <h1>Spotify Streams: {spotifyStreams}</h1>
                </div>
                <div className="flex border-1 border-gray-600 p-4">
                    <h1>YouTube Streams: {youtubeStreams}</h1>
                </div>
            </div>
        </>
    )
}

export default Totals;