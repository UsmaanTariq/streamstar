interface TotalsProps {
    totalStreams: number
    youtubeStreams: number
    spotifyStreams: number
}

const Totals = ({ totalStreams, youtubeStreams, spotifyStreams }: TotalsProps) => {
    return (
        <>
            <div className="flex gap-2 items-center justify-center w-full p-2 py-4 ">
                <div className="flex flex-col border border-purple-200 rounded-xl p-6 shadow-lg w-1/3 text-black">
                    <p className="text-sm font-medium opacity-90 mb-1">Total Streams</p>
                    <h1 className="text-2xl font-bold">{totalStreams.toLocaleString()}</h1>
                </div>
                <div className="flex flex-col border border-green-200 rounded-xl p-6 shadow-lg w-1/3 text-black">
                    <p className="text-sm font-medium opacity-90 mb-1">Spotify Streams</p>
                    <h1 className="text-2xl font-bold">{spotifyStreams.toLocaleString()}</h1>
                </div>
                <div className="flex flex-col border border-red-200 rounded-xl p-6 shadow-lg w-1/3 text-black">
                    <p className="text-sm font-medium opacity-90 mb-1">YouTube Streams</p>
                    <h1 className="text-2xl font-bold">{youtubeStreams.toLocaleString()}</h1>
                </div>
            </div>
        </>
    )
}

export default Totals;