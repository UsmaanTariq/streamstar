'use client'
import { ResponsiveContainer, BarChart, XAxis, Tooltip, YAxis, Bar } from "recharts"

const StreamsByArtist = ({streamsByArtist}: { streamsByArtist: any[]}) => {
    if (!streamsByArtist.length) return null

    return (
        <div className="mt-8 bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Streams by Artist</h2>
            <p className="text-sm text-gray-500 mb-3">Total streams broken down by artists you've worked with</p>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={streamsByArtist} margin={{ top: 30, right: 20, left: 10, bottom: 50 }}>
                <XAxis
                    dataKey="artist"
                    height={45}
                    interval={0}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value: string) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                />
                <YAxis hide />
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                    <p className="font-semibold text-gray-800">{data.artist}</p>
                                    <p className="text-sm text-gray-600">Total: {data.total_streams.toLocaleString()}</p>
                                    <p className="text-sm text-green-600">Spotify: {data.spotify_streams.toLocaleString()}</p>
                                    <p className="text-sm text-red-600">YouTube: {data.youtube_streams.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Tracks: {data.track_count}</p>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Bar 
                    dataKey="total_streams" 
                    fill="#ea801c"
                    label={{
                        position: 'top',
                        formatter: (value: any) => typeof value === 'number' ? value.toLocaleString() : value,
                        fontSize: 12,
                        fill: '#000000'
                    }}
                />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default StreamsByArtist;