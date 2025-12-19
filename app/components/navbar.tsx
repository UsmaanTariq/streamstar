'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUser, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ChartAreaIcon } from 'lucide-react'

export default function Navbar() {
    const router = useRouter()
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
            console.error('Error checking user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            setUser(null)
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <nav className="sticky top-0 z-50 bg-[#0A0908] backdrop-blur-md border-b border-zinc-800 px-8 py-4 shadow-lg">
            <div className="max-w-10xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            {/* <svg className="w-6 h-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg> */}
                            <ChartAreaIcon />
                        </div>
                    </div>
                    <span className="text-xl font-bold text-white">
                        StreamStar
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-2">
                    <Link href="/searchtrack" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all">
                        Search Tracks
                    </Link>
                    <Link href="/searchartist" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all">
                        Search Artists
                    </Link>
                    {user && (
                        <Link href="/myprofile" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all">
                            My Profile
                        </Link>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="px-4 py-2 text-zinc-500">Loading...</div>
                    ) : user ? (
                        <>
                            <span className="text-sm text-zinc-400 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700">
                                {user.email}
                            </span>
                            <button 
                                onClick={handleSignOut}
                                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg hover:shadow-red-500/20"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all">
                                Sign In
                            </Link>
                            <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:from-emerald-700 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-emerald-500/20">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

