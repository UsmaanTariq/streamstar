'use client'

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import { getAllUserTracksStats, IndividualTrackStats } from "@/lib/stats/getTrackStats"
import Image from "next/image"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const TrackBreakdown = () => {
    const [loading, setLoading] = useState(true)
    const [tracks, setTracks] = useState<IndividualTrackStats[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTrackBreakdown()
    }, [])

    const loadTrackBreakdown = async () => {
        try {
            setLoading(true)
            const user = await getUser()
            
            if (!user) {
                setError('Please sign in to view track breakdown')
                return
            }

            const stats = await getAllUserTracksStats(user.id)
            setTracks(stats.tracks)
        } catch (err: any) {
            setError(err.message || 'Failed to load track breakdown')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8 bg-[#DFE0E2]">
                <div className="flex flex-col max-w-7xl w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg p-6">
                    <p className="text-gray-500">Loading track breakdown...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center p-8 bg-[#DFE0E2]">
                <div className="flex flex-col max-w-7xl w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg p-6">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        )
    }

    if (tracks.length === 0) {
        return (
            <div className="flex justify-center p-8 bg-[#DFE0E2]">
                <div className="flex flex-col max-w-7xl w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg p-6">
                    <p className="text-gray-500">No tracks found. Add some tracks to see your breakdown!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-center bg-[#DFE0E2]">
            <div className="flex flex-col p-8 max-w-12xl w-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Breakdown</h2>
                
                <div className="space-y-6">
                    {tracks.map((track) => {
                        // Compute dynamic y-axis bounds so charts aren't flattened
                        const values = track.streamHistory.map((s) => s.totalStreams || 0)
                        const minVal = values.length ? Math.min(...values) : 0
                        const maxVal = values.length ? Math.max(...values) : 0

                        const spotifyValues = track.streamHistory.map((s) => s.spotifyStreams || 0)
                        const spotifyMinVal = spotifyValues.length ? Math.min(...spotifyValues) : 0
                        const spotifyMaxVal = spotifyValues.length ? Math.max(...spotifyValues) : 0

                        const range = Math.max(1, maxVal - minVal)
                        const spotifyRange = Math.max(1, spotifyMaxVal - spotifyMinVal)

                        const padding = range * 0.1
                        const spotifyPadding = spotifyRange * 0.1

                        const yMin = Math.max(0, minVal - padding)
                        const yMax = maxVal + padding

                        const spotifyYMin = Math.max(0, spotifyMinVal - spotifyPadding)
                        const spotifyYMax = spotifyMaxVal + spotifyPadding

                        return (
                        <div key={track.trackId} className="bg-white rounded-lg shadow-lg p-6">
                            {/* Track Header */}
                            <div className="flex gap-4 mb-4">
                                <Image 
                                    src={track.imageUrl || '/placeholder.png'} 
                                    alt={track.trackName}
                                    width={100}
                                    height={100}
                                    className="rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{track.trackName}</h3>
                                    <p className="text-gray-600">{track.artistName}</p>
                                    <p className="text-sm text-gray-500">{track.albumName}</p>
                                    <div className="flex gap-2 mt-2">
                                        {track.role.map((role, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Stats Cards */}
                                <div className="flex gap-3">
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 min-w-[120px]">
                                        <p className="text-xs text-green-600">Spotify</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {track.spotifyStreams.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 min-w-[120px]">
                                        <p className="text-xs text-red-600">YouTube</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {track.youtubeStreams.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 min-w-[120px]">
                                        <p className="text-xs text-purple-600">Total</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {track.totalStreams.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stream History Chart */}
                            {track.streamHistory.length > 1 && (
                                <>
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Stream History</h4>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <AreaChart data={track.streamHistory}>
                                            <defs>
                                                <linearGradient id={`gradient-${track.trackId}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 10 }}
                                                domain={[yMin, yMax]}
                                                tickFormatter={(value) => {
                                                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                                                    return value.toString()
                                                }}
                                            />
                                            <Tooltip 
                                                formatter={(value: number) => value.toLocaleString()}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="totalStreams" 
                                                stroke="#3b82f6" 
                                                fill={`url(#gradient-${track.trackId})`}
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Stream History</h4>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <AreaChart data={track.streamHistory}>
                                            <defs>
                                                <linearGradient id={`gradient-${track.trackId}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fontSize: 10 }}
                                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 10 }}
                                                domain={[spotifyYMin, spotifyYMax]}
                                                tickFormatter={(value) => {
                                                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                                                    return value.toString()
                                                }}
                                            />
                                            <Tooltip 
                                                formatter={(value: number) => value.toLocaleString()}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="spotifyStreams" 
                                                stroke="#3b82f6" 
                                                fill={`url(#gradient-${track.trackId})`}
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                </> 
                            )}
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default TrackBreakdown