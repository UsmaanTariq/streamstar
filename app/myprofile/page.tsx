import { getProducerStats } from "@/lib/stats/getProducerStats";
import Navbar from "../components/navbar";
import ProfileHeader from "./components/ProfileHeader";
import TrackSection from "./components/TrackSection";
import { createClient } from "@/utils/supabase/client";


export default function MyProfile() {

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <ProfileHeader />
                <TrackSection />
            </div>
        </>
    )
}