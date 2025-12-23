'use client'
import { useEffect, useState } from "react"
import { getUser } from '@/lib/auth'
import { createClient } from '@/utils/supabase/client'
import Image from "next/image"
import AvatarUpload from "./AvatarUpload"

interface ProfileHeaderProps {
    userStats?: any
    userProfile?: {
        user_name: string
        avatar_url: string | null
        email: string
    } | null
    loading?: boolean
}

const ProfileHeader = ({ userStats, userProfile, loading: statsLoading }: ProfileHeaderProps) => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

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
        } catch (error) {
            console.log('Catch error:', error)
        } finally {
            setLoading(false)
        }
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
            <div className="px-12 py-8 flex justify-center bg-[#DFE0E2]">
                <div className="flex gap-8 max-w-7xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex flex-col w-1/4 bg-gradient-to-br from-gray-50 to-gray-300 justify-center items-center p-10">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20"></div>
                            <AvatarUpload 
                                userId={user.id} 
                                currentAvatarUrl={userProfile?.avatar_url || undefined}
                                onUploadComplete={(url) => {
                                    // Avatar updated, will be refreshed on next load
                                    console.log('Avatar updated:', url)
                                }}
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Producer
                            </h3>
                            <p className="text-xl font-bold text-gray-800">
                                {userProfile ? userProfile.user_name : 'Loading...'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center w-3/4 p-10 gap-6">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Profile Information
                            </h2>
                            <h1 className="text-4xl font-bold text-gray-900 mb-1">
                                {userProfile ? userProfile.user_name : 'Welcome'}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {userProfile?.email || user?.email}
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <div className="flex-1 bg-black rounded-xl p-4">
                                <p className="text-sm text-white mb-1">Total Streams</p>
                                <p className="text-lg font-semibold text-white">
                                    {statsLoading ? 'Loading...' : (userStats?.totalStreams?.total?.toLocaleString() || '0')}
                                </p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500 mb-1">Tracks Produced</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {statsLoading ? 'Loading...' : (userStats?.trackCount || '0')}
                                </p>
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