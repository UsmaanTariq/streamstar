'use client'
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { getUser } from "@/lib/auth"
import { getProducerStats } from "@/lib/stats/getProducerStats"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, XAxis, YAxis, Bar, AreaChart, Area } from 'recharts'
import { useProfileInsights } from "@/hooks/useProfileInsight"
import StreamsByArtist from "./graphs/StreamsByArtist"

const ProfileInsight = () => {
    const { user, userStats, loading, error} = useProfileInsights()
    console.log(userStats)

    if (loading) {
        return (
            <div className="px-16 py-6 flex justify-center bg-[#DFE0E2]">
                <div className="flex flex-col max-w-7xl w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden p-6">
                    <p className="text-gray-500">Loading insights...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <>
            <div className="flex justify-center bg-[#DFE0E2]">
                <div className="flex flex-col p-8 max-w-12xl w-full  bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden border-gray-300 border-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Insights</h2>
                    
                    {userStats?.totalStreams?.total > 0 ? (
                        <div className="flex items-center gap-8">
                            <ResponsiveContainer width="50%" height={300}>
                                <PieChart className="bg-white shadow-lg rounded-lg border-1 border-gray-200">
                                    <Pie
                                        data={[
                                            { name: 'Spotify', value: userStats.totalStreams.spotify },
                                            { name: 'YouTube', value: userStats.totalStreams.youtube }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        <Cell fill="#1DB954" />
                                        <Cell fill="#FF0000" />
                                    </Pie>
                                    <Tooltip formatter={(value: number) => value.toLocaleString()} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="flex-1 space-y-4">
                                <div className="bg-white rounded-lg p-4 shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#1DB954]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Spotify Streams</p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {userStats.totalStreams.spotify.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">YouTube Views</p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {userStats.totalStreams.youtube.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg p-4 shadow bg-white ">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex=1">
                                        <p className="text-sm text-gray-500">Total Streams</p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {userStats.totalStreams.total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No stream data available yet. Add some tracks to get started!</p>
                    )}

                    {/* Charts Row - Top Tracks and Streams by Role */}
                    {(userStats?.topTracks && userStats.topTracks.length > 0) || (userStats?.streamsByRole && userStats.streamsByRole.length > 0) ? (
                        <div className="mt-8 flex gap-6 flex-wrap lg:flex-nowrap">
                            {/* Top Tracks Bar Chart */}
                            {userStats?.topTracks && userStats.topTracks.length > 0 && (
                                <div className="flex-1 min-w-[400px] bg-white p-4 shadow-lg rounded-lg">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Top 5 Tracks</h2>
                                    <p className="text-sm text-gray-500 mb-3">Total streams broken down by your most popular songs</p>
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart 
                                            data={userStats.topTracks}
                                            margin={{ top: 30, right: 20, left: 10, bottom: 50 }}
                                        >
                                            <XAxis 
                                                dataKey="track_name"
                                                angle={0}
                                                height={45}
                                                interval={0}
                                                tick={{ fontSize: 11 }}
                                                tickFormatter={(value: string) => 
                                                    value.length > 15 ? `${value.substring(0, 15)}...` : value
                                                }
                                            />
                                            <YAxis hide />
                                            <Tooltip 
                                                formatter={(value: number) => value.toLocaleString()}
                                                labelFormatter={(label) => `Track: ${label}`}
                                            />
                                            <Bar 
                                                dataKey="total_streams" 
                                                fill="#1a80bb"
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
                            )}

                            {/* Streams by Role Bar Chart */}
                            {userStats?.streamsByRole && userStats.streamsByRole.length > 0 && (
                                <div className="flex-1 min-w-[400px] bg-white p-4 shadow-lg rounded-lg">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Streams by Role</h2>
                                    <p className="text-sm text-gray-500 mb-3">Total streams broken down by your production role</p>
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart 
                                            data={userStats.streamsByRole}
                                            margin={{ top: 30, right: 20, left: 10, bottom: 20 }}
                                        >
                                            <XAxis 
                                                dataKey="role"
                                                angle={0}

                                                height={70}
                                                interval={0}
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value: string) => 
                                                    value.length > 15 ? `${value.substring(0, 15)}...` : value
                                                }
                                            />
                                            <YAxis hide />
                                            <Tooltip 
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload
                                                        return (
                                                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                                                <p className="font-semibold text-gray-800">{data.role}</p>
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
                                                fill="#6366f1"
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
                            )}
                        </div>
                    ) : null}
                    {/* Streams Trend Area Chart */}
                    {userStats?.streamsByDate && userStats.streamsByDate.length > 0 && (
                        <div className="mt-8 bg-white p-4 shadow-lg rounded-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Stream Trends</h2>
                            <p className="text-sm text-gray-500 mb-3">Your total streams over the past 7 days</p>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart
                                    data={userStats.streamsByDate}
                                    margin={{ top: 30, right: 30, left: 10, bottom: 50 }}
                                >
                                    <defs>
                                        <linearGradient id="colorSpotify" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#1DB954" stopOpacity={0.1}/>
                                        </linearGradient>
                                        <linearGradient id="colorYoutube" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="date"
                                        tickFormatter={(value: string) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                        }}
                                        tick={{ fontSize: 11 }}
                                        angle={0}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={(value: number) => {
                                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                                            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                                            return value.toString()
                                        }}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload
                                                const date = new Date(data.date)
                                                return (
                                                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                                        <p className="font-semibold text-gray-800 mb-2">
                                                            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                        </p>
                                                        <p className="text-sm text-gray-600">Total: {data.total_streams.toLocaleString()}</p>
                                                        <p className="text-sm text-green-600">Spotify: {data.spotify_streams.toLocaleString()}</p>
                                                        <p className="text-sm text-red-600">YouTube: {data.youtube_streams.toLocaleString()}</p>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="spotify_streams" 
                                        stackId="1"
                                        stroke="#1DB954" 
                                        fill="url(#colorSpotify)"
                                        strokeWidth={2}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="youtube_streams" 
                                        stackId="1"
                                        stroke="#FF0000" 
                                        fill="url(#colorYoutube)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {userStats?.streamsByArtist && userStats.streamsByArtist.length > 0 && (
                        <StreamsByArtist streamsByArtist={userStats.streamsByArtist} />
                    )}
                </div>
            </div>
        </>
    )

}

export default ProfileInsight;