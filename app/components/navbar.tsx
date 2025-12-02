'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUser, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

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
        <nav className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-black">ProducerWrapped</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <Link href="/searchtrack" className="text-gray-700 hover:text-black font-medium transition-colors">
                        Search Tracks
                    </Link>
                    <Link href="/searchartist" className="text-gray-700 hover:text-black font-medium transition-colors">
                        Search Artists
                    </Link>
                    {user && (
                        <Link href="/myprofile" className="text-gray-700 hover:text-black font-medium transition-colors">
                            My Profile
                        </Link>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="px-4 py-2 text-gray-400">Loading...</div>
                    ) : user ? (
                        <>
                            <span className="text-sm text-gray-600">
                                {user.email}
                            </span>
                            <button 
                                onClick={handleSignOut}
                                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="px-4 py-2 text-gray-700 hover:text-black font-medium transition-colors">
                                Sign In
                            </Link>
                            <Link href="/signup" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

