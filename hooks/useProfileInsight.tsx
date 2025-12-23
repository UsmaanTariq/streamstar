// hooks/useProfileInsights.ts
'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getUser } from '@/lib/auth'
import { getProducerStats } from '@/lib/stats/getProducerStats'

type UserProfile = {
  user_name: string
  avatar_url: string | null
  email: string
}

type UseProfileInsightsResult = {
  user: any | null
  userProfile: UserProfile | null
  userStats: any | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProfileInsights(): UseProfileInsightsResult {
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1) Load initial user + subscribe to auth changes
  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        setLoading(true)
        const currentUser = await getUser()
        if (mounted) setUser(currentUser ?? null)
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to load user')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  // 2) Fetch stats and profile whenever user.id changes
  const fetchStats = async (userId: string) => {
    setError(null)
    setLoading(true)
    try {
      // Fetch both stats and profile in parallel
      const [statsData, profileData] = await Promise.all([
        getProducerStats(userId),
        supabase
          .from('users')
          .select('user_name, avatar_url, email')
          .eq('user_id', userId)
          .single()
      ])
      
      setUserStats(statsData)
      
      if (profileData.error) {
        console.error('Error fetching profile:', profileData.error)
      } else {
        setUserProfile(profileData.data)
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load stats')
      setUserStats(null)
      setUserProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.id) {
      setUserStats(null)
      setUserProfile(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        // Fetch both stats and profile in parallel
        const [statsData, profileData] = await Promise.all([
          getProducerStats(user.id),
          supabase
            .from('users')
            .select('user_name, avatar_url, email')
            .eq('user_id', user.id)
            .single()
        ])

        if (!cancelled) {
          setUserStats(statsData)
          
          if (profileData.error) {
            console.error('Error fetching profile:', profileData.error)
          } else {
            setUserProfile(profileData.data)
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load stats')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, supabase])

  return {
    user,
    userProfile,
    userStats,
    loading,
    error,
    refetch: async () => {
      if (!user?.id) return
      await fetchStats(user.id)
    },
  }
}
