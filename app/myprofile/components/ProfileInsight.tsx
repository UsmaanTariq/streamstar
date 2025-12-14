'use client'
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { getUser } from "@/lib/auth"
import { getProducerStats } from "@/lib/stats/getProducerStats"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const ProfileInsight = () => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [userStats, setUserStats] = useState<any>(null)

    useEffect(() => {
        // Check user on mount
        checkUser()

        // Listen for auth changes
        const supabase = createClient()
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        // Get stats when user is loaded
        if (user?.id) {
            getUserStats()
        }
    }, [user])

    const checkUser = async () => {
        try {
            const currentUser = await getUser()
            setUser(currentUser)
        } catch (error) {
            console.error('Error checking user:', error)
        } finally {
            setLoading(false)
        }
    }

    const getUserStats = async () => {
        if (!user?.id) return
        
        try {
            const userData = await getProducerStats(user.id)
            setUserStats(userData)
        } catch (error) {
            console.error('Error getting user stats:', error)
        }
    }

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
            <div className="px-16 py-6 flex justify-center bg-[#DFE0E2]">
                <div className="flex flex-col p-8 max-w-7xl w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Stream Distribution</h2>
                    
                    {userStats?.totalStreams?.total > 0 ? (
                        <div className="flex items-center gap-8">
                            <ResponsiveContainer width="50%" height={300}>
                                <PieChart>
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
                                        <div className="w-4 h-4 rounded-full bg-[#1DB954]"></div>
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
                                        <div className="w-4 h-4 rounded-full bg-[#FF0000]"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">YouTube Views</p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {userStats.totalStreams.youtube.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg p-4 shadow">
                                <p className="text-sm text-gray-500">Total Streams</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {userStats.totalStreams.youtube.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No stream data available yet. Add some tracks to get started!</p>
                    )}
                </div>
            </div>
        </>
    )

}

export default ProfileInsight;