'use client'

import { useProfileInsights } from "@/hooks/useProfileInsight"
import Navbar from "../components/navbar"
import Totals from "./components/totals"
import UserInfo from "./components/UserInfo"
import TopTracksCard from "./components/TopTracksCard"
import TopRolesCard from "./components/TopRolesCard"

export default function ProducerWrapped() {
    const { user, userProfile, userStats, loading, error } = useProfileInsights()

    const topTracks = userStats?.topTracks || []
    const topRoles = userStats?.streamsByRole || []
    const totalStreams = userStats?.totalStreams?.total || 0
    const spotifyStreams = userStats?.totalStreams?.spotify || 0
    const youtubeStreams = userStats?.totalStreams?.youtube || 0
    const trackCount = userStats?.trackCount  || 0

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <h1 className="text-2xl font-bold">Loading your stats...</h1>
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Error loading stats</h1>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </>
        )
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <h1 className="text-2xl font-bold">Please sign in to view your stats</h1>
                </div>
            </>
        )
    }

    const currentYear = new Date().getFullYear()

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-12 px-4">
                <div className="max-w-10xl mx-auto">
                    {/* Main Wrapped Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header Section */}

                        {/* Content Grid */}
                        <div className="p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Top Tracks */}
                                <div className="lg:col-span-1">
                                    <TopTracksCard topTracks={topTracks}/>
                                </div>

                                {/* Center Column - Main Stats */}
                                <div className="lg:col-span-1 space-y-6">
                                    <UserInfo userProfile={userProfile} totalStreams={totalStreams} trackCount={trackCount}/>
                                    <Totals 
                                        totalStreams={totalStreams} 
                                        youtubeStreams={youtubeStreams} 
                                        spotifyStreams={spotifyStreams}
                                        track_count={trackCount}
                                    />
                                </div>

                                {/* Right Column - Top Roles */}
                                <div className="lg:col-span-1">
                                    <TopRolesCard topRoles={topRoles} />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-neutral-50 px-12 py-6 border-t border-neutral-200 text-center">
                            <p className="text-neutral-600 text-sm">Share your Producer Wrapped</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}