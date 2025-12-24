'use client'

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import { getAllUserTracksStats, IndividualTrackStats } from "@/lib/stats/getTrackStats"
import Image from "next/image"
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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
                        // Calculate daily changes for each data point
                        const chartData = track.streamHistory.map((point, index) => {
                            const prevPoint = index > 0 ? track.streamHistory[index - 1] : point
                            return {
                                ...point,
                                totalChange: index > 0 ? point.totalStreams - prevPoint.totalStreams : 0,
                                spotifyChange: index > 0 ? point.spotifyStreams - prevPoint.spotifyStreams : 0,
                                youtubeChange: index > 0 ? point.youtubeStreams - prevPoint.youtubeStreams : 0
                            }
                        })

                        // Compute dynamic y-axis bounds for each chart type
                        const totalValues = track.streamHistory.map((s) => s.totalStreams || 0)
                        const totalMinVal = totalValues.length ? Math.min(...totalValues) : 0
                        const totalMaxVal = totalValues.length ? Math.max(...totalValues) : 0
                        const totalRange = Math.max(1, totalMaxVal - totalMinVal)
                        const totalPadding = totalRange * 0.05
                        const totalYMin = Math.max(0, totalMinVal - totalPadding)
                        const totalYMax = totalMaxVal + totalPadding

                        const spotifyValues = track.streamHistory.map((s) => s.spotifyStreams || 0)
                        const spotifyMinVal = spotifyValues.length ? Math.min(...spotifyValues) : 0
                        const spotifyMaxVal = spotifyValues.length ? Math.max(...spotifyValues) : 0
                        const spotifyRange = Math.max(1, spotifyMaxVal - spotifyMinVal)
                        const spotifyPadding = spotifyRange * 0.1
                        const spotifyYMin = Math.max(0, spotifyMinVal - spotifyPadding)
                        const spotifyYMax = spotifyMaxVal + spotifyPadding

                        const youtubeValues = track.streamHistory.map((s) => s.youtubeStreams || 0)
                        const youtubeMinVal = youtubeValues.length ? Math.min(...youtubeValues) : 0
                        const youtubeMaxVal = youtubeValues.length ? Math.max(...youtubeValues) : 0
                        const youtubeRange = Math.max(1, youtubeMaxVal - youtubeMinVal)
                        const youtubePadding = youtubeRange * 0.1
                        const youtubeYMin = Math.max(0, youtubeMinVal - youtubePadding)
                        const youtubeYMax = youtubeMaxVal + youtubePadding

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
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 min-w-[120px] border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#1DB954]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                            </svg>
                                            <p className="text-xs text-green-700 font-medium">Spotify</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            {track.spotifyStreams.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 min-w-[120px] border border-red-200">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                            <p className="text-xs text-red-700 font-medium">YouTube</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            {track.youtubeStreams.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 min-w-[120px] border border-purple-200">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-xs text-purple-700 font-medium">Total</p>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            {track.totalStreams.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stream History Charts */}
                            {track.streamHistory.length > 1 && (
                                <div className="mt-6 space-y-4">
                                    {/* Total Streams Chart */}
                                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                            </svg>
                                            <h4 className="text-sm font-semibold text-gray-800">Total Stream History</h4>
                                        </div>
                                        <ResponsiveContainer width="100%" height={150}>
                                            <ComposedChart data={chartData}>
                                                <defs>
                                                    <linearGradient id={`total-gradient-${track.trackId}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis 
                                                    dataKey="date" 
                                                    tick={{ fontSize: 10 }}
                                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                />
                                                <YAxis 
                                                    yAxisId="left"
                                                    tick={{ fontSize: 10 }}
                                                    domain={[totalYMin, totalYMax]}
                                                    tickFormatter={(value) => {
                                                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                                                        return value.toString()
                                                    }}
                                                />
                                                <YAxis 
                                                    yAxisId="right"
                                                    orientation="right"
                                                    tick={{ fontSize: 10 }}
                                                    tickFormatter={(value) => {
                                                        if (value >= 1000) return `+${(value / 1000).toFixed(0)}K`
                                                        return value > 0 ? `+${value}` : value.toString()
                                                    }}
                                                />
                                                <Tooltip 
                                                    formatter={(value: number, name: string) => {
                                                        if (name === 'Daily Change') {
                                                            return [value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString(), name]
                                                        }
                                                        return [value.toLocaleString(), name]
                                                    }}
                                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                                    contentStyle={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                                <Area 
                                                    yAxisId="left"
                                                    type="monotone" 
                                                    dataKey="totalStreams" 
                                                    name="Total Streams"
                                                    stroke="#8b5cf6" 
                                                    fill={`url(#total-gradient-${track.trackId})`}
                                                    strokeWidth={2}
                                                />
                                                <Line 
                                                    yAxisId="right"
                                                    type="monotone" 
                                                    dataKey="totalChange"
                                                    name="Daily Change"
                                                    stroke="#ec4899" 
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    dot={{ r: 3 }}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Spotify & YouTube Charts Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Spotify Chart */}
                                    <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-5 h-5 text-[#1DB954]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                            </svg>
                                            <h4 className="text-sm font-semibold text-gray-800">Spotify Streams</h4>
                                        </div>
                                        <ResponsiveContainer width="100%" height={150}>
                                            <ComposedChart data={chartData}>
                                                <defs>
                                                    <linearGradient id={`spotify-gradient-${track.trackId}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#1DB954" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis 
                                                    dataKey="date" 
                                                    tick={{ fontSize: 10 }}
                                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                />
                                                <YAxis 
                                                    yAxisId="left"
                                                    tick={{ fontSize: 10 }}
                                                    domain={[spotifyYMin, spotifyYMax]}
                                                    tickFormatter={(value) => {
                                                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                                                        return value.toString()
                                                    }}
                                                />
                                                <YAxis 
                                                    yAxisId="right"
                                                    orientation="right"
                                                    tick={{ fontSize: 10 }}
                                                    tickFormatter={(value) => {
                                                        if (value >= 1000) return `+${(value / 1000).toFixed(0)}K`
                                                        return value > 0 ? `+${value}` : value.toString()
                                                    }}
                                                />
                                                <Tooltip 
                                                    formatter={(value: number, name: string) => {
                                                        if (name === 'Daily Change') {
                                                            return [value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString(), name]
                                                        }
                                                        return [value.toLocaleString(), name]
                                                    }}
                                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                                    contentStyle={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                                <Area 
                                                    yAxisId="left"
                                                    type="monotone" 
                                                    dataKey="spotifyStreams"
                                                    name="Spotify Streams"
                                                    stroke="#1DB954" 
                                                    fill={`url(#spotify-gradient-${track.trackId})`}
                                                    strokeWidth={2}
                                                />
                                                <Line 
                                                    yAxisId="right"
                                                    type="monotone" 
                                                    dataKey="spotifyChange"
                                                    name="Daily Change"
                                                    stroke="#15803d" 
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    dot={{ r: 3 }}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* YouTube Chart */}
                                    <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border border-red-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                            <h4 className="text-sm font-semibold text-gray-800">YouTube Views</h4>
                                        </div>
                                        <ResponsiveContainer width="100%" height={150}>
                                            <ComposedChart data={chartData}>
                                                <defs>
                                                    <linearGradient id={`youtube-gradient-${track.trackId}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#FF0000" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis 
                                                    dataKey="date" 
                                                    tick={{ fontSize: 10 }}
                                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                />
                                                <YAxis 
                                                    yAxisId="left"
                                                    tick={{ fontSize: 10 }}
                                                    domain={[youtubeYMin, youtubeYMax]}
                                                    tickFormatter={(value) => {
                                                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                                                        return value.toString()
                                                    }}
                                                />
                                                <YAxis 
                                                    yAxisId="right"
                                                    orientation="right"
                                                    tick={{ fontSize: 10 }}
                                                    tickFormatter={(value) => {
                                                        if (value >= 1000) return `+${(value / 1000).toFixed(0)}K`
                                                        return value > 0 ? `+${value}` : value.toString()
                                                    }}
                                                />
                                                <Tooltip 
                                                    formatter={(value: number, name: string) => {
                                                        if (name === 'Daily Change') {
                                                            return [value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString(), name]
                                                        }
                                                        return [value.toLocaleString(), name]
                                                    }}
                                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                                    contentStyle={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                                <Area 
                                                    yAxisId="left"
                                                    type="monotone" 
                                                    dataKey="youtubeStreams"
                                                    name="YouTube Views"
                                                    stroke="#FF0000" 
                                                    fill={`url(#youtube-gradient-${track.trackId})`}
                                                    strokeWidth={2}
                                                />
                                                <Line 
                                                    yAxisId="right"
                                                    type="monotone" 
                                                    dataKey="youtubeChange"
                                                    name="Daily Change"
                                                    stroke="#dc2626" 
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    dot={{ r: 3 }}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                    </div>
                                </div>
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