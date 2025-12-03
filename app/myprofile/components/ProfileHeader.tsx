'use client'
import { useEffect, useState } from "react"
import { getUser } from '@/lib/auth'
import { createClient } from '@/utils/supabase/client'
import Image from "next/image"

const ProfileHeader = () => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [totalStreams, setTotalStreams] = useState<number>(0)
    const [trackCount, setTrackCount] = useState<number>(0)

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

    const checkUser = async () => {
        try {
            const currentUser = await getUser()
            setUser(currentUser)

            if (!currentUser) {
                console.log('No user found')
                return
            }

            const supabase = createClient()
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', currentUser.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                return
            }

            console.log('Profile data:', data)
            setProfile(data)

            // Count streams after getting profile
            await countStreams(currentUser.id)

        } catch (error) {
            console.log('Catch error:', error)
        } finally {
            setLoading(false)
        }
    }
    
    const countStreams = async (userId: string) => {
        const supabase = createClient()

        // Get user's track IDs
        const { data: userTracks, error: userTracksError } = await supabase
            .from('user_tracks')
            .select('track_id')
            .eq('user_id', userId)

        if (userTracksError || !userTracks) {
            console.error('Error fetching user tracks:', userTracksError)
            return
        }

        if (userTracks.length === 0) {
            setTotalStreams(0)
            setTrackCount(0)
            return
        }

        // Get track IDs
        const trackIds = userTracks.map((ut: any) => ut.track_id)
        setTrackCount(trackIds.length)

        // Get streams from tracks
        const { data: tracks, error: tracksError } = await supabase
            .from('tracks')
            .select('spotify_streams')
            .in('id', trackIds)

        if (tracksError || !tracks) {
            console.error('Error fetching tracks:', tracksError)
            return
        }

        // Sum all streams
        const total = tracks.reduce((sum: number, track: any) => {
            return sum + (track.spotify_streams || 0)
        }, 0)

        setTotalStreams(total)
    }
    if (loading) {
        return (
            <div className="px-12 py-6 flex justify-center items-center min-h-[300px]">
                <p className="text-lg text-gray-500">Loading profile...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="px-12 py-6 flex justify-center items-center min-h-[300px]">
                <p className="text-lg text-gray-500">Not logged in</p>
            </div>
        )
    }

    return (
        <>
            <div className="px-12 py-8 flex justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="flex gap-8 max-w-7xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col w-1/4 bg-gradient-to-br from-gray-50 to-gray-100 justify-center items-center p-10">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20"></div>
                            <Image 
                                src='window.svg' 
                                width={120} 
                                height={120} 
                                alt="Profile Picture" 
                                className="relative rounded-full border-4 border-white shadow-xl"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Producer
                            </h3>
                            <p className="text-xl font-bold text-gray-800">
                                {profile ? profile.user_name : 'Loading...'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center w-3/4 p-10 gap-6">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Profile Information
                            </h2>
                            <h1 className="text-4xl font-bold text-gray-900 mb-1">
                                {profile ? profile.user_name : 'Welcome'}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {user.email}
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <div className="flex-1 bg-black rounded-xl p-4">
                                <p className="text-sm text-white mb-1">Total Streams</p>
                                <p className="text-lg font-semibold text-white">
                                    {totalStreams.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500 mb-1">Tracks Produced</p>
                                <p className="text-lg font-semibold text-gray-800">{trackCount}</p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileHeader;