'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUser, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ChartAreaIcon, Menu, X } from 'lucide-react'

export default function Navbar() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
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
            setMobileMenuOpen(false)
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const closeMobileMenu = () => setMobileMenuOpen(false)

    return (
        <nav className="sticky top-0 z-50 bg-[#0A0908] backdrop-blur-md border-b border-zinc-800 px-4 lg:px-8 py-4 shadow-lg">
            <div className="max-w-10xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group" onClick={closeMobileMenu}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-white rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <ChartAreaIcon />
                        </div>
                    </div>
                    <span className="text-xl font-bold text-white">
                        StreamStar
                    </span>
                </Link>

                {/* Desktop Navigation Links - hidden below 1024px */}
                <div className="hidden lg:flex items-center gap-2">
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
                    {user && (
                        <Link href="/achievements" className="px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all">
                            Wrapped
                        </Link>
                    )}
                </div>

                {/* Desktop Auth Buttons - hidden below 1024px */}
                <div className="hidden lg:flex items-center gap-4">
                    {loading ? (
                        <div className="px-4 py-2 text-zinc-500">Loading...</div>
                    ) : user ? (
                        <>
                            {/* <span className="text-sm text-zinc-400 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700 max-w-[200px] truncate">
                                {user.email}
                            </span> */}
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

                {/* Mobile Menu Button - visible below 1024px, hidden at 1024px+ */}
                <button
                    className="mobile-menu-button p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu - only renders when open AND below 1024px */}
            {mobileMenuOpen && (
                <div className="mobile-menu flex flex-col mt-4 pt-4 border-t border-zinc-800 gap-2">
                    {/* Navigation Links */}
                    <Link 
                        href="/searchtrack" 
                        className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all"
                        onClick={closeMobileMenu}
                    >
                        Search Tracks
                    </Link>
                    <Link 
                        href="/searchartist" 
                        className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all"
                        onClick={closeMobileMenu}
                    >
                        Search Artists
                    </Link>
                    {user && (
                        <Link 
                            href="/myprofile" 
                            className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all"
                            onClick={closeMobileMenu}
                        >
                            My Profile
                        </Link>
                    )}

                    {/* Auth Section */}
                    <div className="border-t border-zinc-800 mt-2 pt-4">
                        {loading ? (
                            <div className="px-4 py-2 text-zinc-500">Loading...</div>
                        ) : user ? (
                            <div className="flex flex-col gap-3">
                                <span className="text-sm text-zinc-400 px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700 truncate">
                                    {user.email}
                                </span>
                                <button 
                                    onClick={handleSignOut}
                                    className="px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg text-center"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link 
                                    href="/signin" 
                                    className="px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg font-medium transition-all text-center"
                                    onClick={closeMobileMenu}
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    href="/signup" 
                                    className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:from-emerald-700 hover:to-cyan-700 transition-all font-medium shadow-lg text-center"
                                    onClick={closeMobileMenu}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
