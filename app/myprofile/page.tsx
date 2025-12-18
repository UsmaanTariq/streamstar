'use client'
import { getProducerStats } from "@/lib/stats/getProducerStats";
import Navbar from "../components/navbar";
import ProfileHeader from "./components/ProfileHeader";
import TrackSection from "./components/TrackSection";
import { createClient } from "@/utils/supabase/client";
import ProfileInsight from "./components/ProfileInsight";
import ProfileSidebar from "./components/ProfileSidebar";
import { useState } from "react";
import Goals from "./components/goals/Goals";

export default function MyProfile() {
    const [activeTab, setActiveTab] = useState<'tracks' | 'insights' | 'breakdown'| 'goals'>('tracks')

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <ProfileHeader />
                <div className = 'flex px-12 py-6 '>
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
                    <div className="flex-1">
                        {activeTab === 'tracks' && <TrackSection />}
                        {activeTab === 'insights' && <ProfileInsight />}
                        {activeTab === 'goals' && <Goals />}
                    </div>
                </div>

            </div>
        </>
    )
}