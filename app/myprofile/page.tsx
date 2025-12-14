'use client'
import { getProducerStats } from "@/lib/stats/getProducerStats";
import Navbar from "../components/navbar";
import ProfileHeader from "./components/ProfileHeader";
import TrackSection from "./components/TrackSection";
import { createClient } from "@/utils/supabase/client";
import ProfileInsight from "./components/ProfileInsight";
import ProfileSidebar from "./components/ProfileSidebar";
import { useState } from "react";

export default function MyProfile() {
    const [activeTab, setActiveTab] = useState<'tracks' | 'insights' | 'breakdown'>('tracks')

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <ProfileHeader />
                <div className = 'flex px-12 py-6 '>
                    <ProfileSidebar />
                    <div className="flex-1">
                        <TrackSection />
                    </div>
                </div>

            </div>
        </>
    )
}