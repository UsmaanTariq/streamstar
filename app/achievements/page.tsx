'use client'

import { useState, useRef } from "react"
import { toPng, toJpeg } from "html-to-image"
import { useProfileInsights } from "@/hooks/useProfileInsight"
import Navbar from "../components/navbar"
import Totals from "./components/totals"

export default function ProducerWrapped() {
    const { user, userProfile, userStats, loading, error } = useProfileInsights()

    const topTracks = userStats?.topTracks?.[0]
    const totalStreams = userStats?.totalStreams?.total || 0
    const spotifyStreams = userStats?.totalStreams?.spotify || 0
    const youtubeStreams = userStats?.totalStreams?.youtube || 0
    const trackCount = userStats?.trackCount  || 0
    const topRole = userStats?.streamByRole?.[0]

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

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8 flex items-center">
                <div className="container mx-auto px-4">
                    <h1>{userProfile?.user_name}</h1>
                    <Totals 
                        totalStreams={totalStreams} 
                        youtubeStreams={youtubeStreams} 
                        spotifyStreams={spotifyStreams}
                    />
                </div>
            </div>
        </>
    )
}