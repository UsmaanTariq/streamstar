'use client'
import { useState } from "react"
import { Music, PieChart, BarChart3 } from 'lucide-react'

interface ProfileSidebarProps {
    activeTab: 'tracks' | 'insights' | 'breakdown'
    setActiveTab: (tab: 'tracks' | 'insights' | 'breakdown') => void
}

const ProfileSidebar = () => {
    const [activeTab, setActiveTab] = useState('tracks')
    return (
        <>
            <div className="w-90 flex=shrink-0">
                <div className='flex flex-col p-8 gap-2 shadow-lg sticky top-6 min-h-screen'>
                    <h1 className='mb-4 text-xl'>Your Dashboard</h1>
                <button
                    onClick={() => setActiveTab('tracks')}
                    className={`w-full text-left p-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
                        activeTab === 'tracks'
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Music className="w-5 h-5" />
                    Tracks
                </button>
                <button
                    onClick={() => setActiveTab('insights')}
                    className={`w-full text-left p-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
                        activeTab === 'insights'
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <PieChart className="w-5 h-5" />
                    Insights
                </button>
                <button
                    onClick={() => setActiveTab('breakdown')}
                    className={`w-full text-left p-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
                        activeTab === 'breakdown'
                            ? 'bg-black text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <BarChart3 className="w-5 h-5" />
                    Track breakdown
                </button>

                </div>
            </div>
        </>
    )
}

export default ProfileSidebar;