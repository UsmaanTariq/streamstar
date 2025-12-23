'use client'
import Navbar from "../components/navbar";
import ProfileHeader from "./components/ProfileHeader";
import TrackSection from "./components/TrackSection";
import ProfileInsight from "./components/ProfileInsight";
import ProfileSidebar from "./components/ProfileSidebar";
import { useState } from "react";
import Goals from "./components/goals/Goals";
import { useProfileInsights } from "@/hooks/useProfileInsight";
import TrackBreakdown from "./components/trackbreakdown/TrackBreakdown";

export default function MyProfile() {
    const [activeTab, setActiveTab] = useState<'tracks' | 'insights' | 'breakdown'| 'goals'>('tracks')
    
    // Fetch stats once at the page level
    const { user, userProfile, userStats, loading, error } = useProfileInsights()

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <ProfileHeader userStats={userStats} userProfile={userProfile} loading={loading} />
                <div className = 'flex px-12 py-6 '>
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
                    <div className="flex-1">
                        {activeTab === 'tracks' && <TrackSection />}
                        {activeTab === 'insights' && <ProfileInsight userStats={userStats} loading={loading} error={error} />}
                        {activeTab === 'goals' && <Goals />}
                        {activeTab === 'breakdown' && <TrackBreakdown />}
                    </div>
                </div>

            </div>
        </>
    )
}