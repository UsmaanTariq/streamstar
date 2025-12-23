'use client'

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import { createClient } from "@/utils/supabase/client"
import Track from './Track'
import { Disc2Icon, TrendingUpIcon } from "lucide-react"
const TrackSection = () => {
    const [data, setData] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Check user on mount
        getTracks()

        // Listen for auth changes
        const supabase = createClient()
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Log when data state changes
    useEffect(() => {
        console.log('Data state changed to:', data)
    }, [data])

    const getTracks = async () => {
        try {
            setLoading(true)
            const currentUser = await getUser()
            setUser(currentUser)

            if (!currentUser) {
                console.log('No user found')
                return
            }

            console.log('User ID:', currentUser.id)
            
            const supabase = createClient()
            
            // Step 1: Get user's track IDs from user_tracks (include id for deletion)
            const { data: userTracksData, error: userTracksError } = await supabase
                .from('user_tracks')
                .select('id, track_id, role, notes')
                .eq('user_id', currentUser.id)
            
            
            if (userTracksError) {
                console.error('Error fetching user tracks:', userTracksError)
                return
            }

            if (!userTracksData || userTracksData.length === 0) {
                console.log('No tracks found for this user')
                setData([])
                return
            }

            // Step 2: Extract track IDs
            const trackIds = userTracksData.map((ut: any) => ut.track_id)

            // Step 3: Get full track details from tracks table
            const { data: tracksData, error: tracksError } = await supabase
                .from('tracks')
                .select('*, track_streams (*)')
                .in('id', trackIds)

            if (tracksError) {
                console.error('Error fetching tracks:', tracksError)
                return
}

            // Step 4: Merge user_tracks.id with tracks data
            const mergedData = tracksData?.map((track: any) => {
                // Use Number() to ensure consistent type comparison
                const userTrack = userTracksData.find((ut: any) => Number(ut.track_id) === Number(track.id))
                console.log('Track ID:', track.id, 'Found userTrack:', userTrack)
                
                // Get the latest track_streams entry by sorting by update_date
                const latestStreams = track.track_streams && track.track_streams.length > 0 
                    ? [...track.track_streams].sort((a: any, b: any) => 
                        new Date(b.update_date || b.created_at).getTime() - new Date(a.update_date || a.created_at).getTime()
                    )[0]  // Get the most recent entry
                    : null
                
                return {
                    ...track,
                    role: userTrack?.role || [],
                    notes: userTrack?.notes || null,
                    user_track_id: userTrack?.id,
                    youtube_streams: latestStreams?.youtube_streams || 0,
                    spotify_streams_updated: latestStreams?.spotify_streams || track.spotify_streams
                }
            }) || []

            console.log('Merged data:', mergedData)
            setData(mergedData)

        } catch (error) {
            console.log('Catch block error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Handle track deletion by removing from state
    const handleTrackDeleted = (user_track_id: number) => {
        setData(prevData => prevData.filter(track => track.user_track_id !== user_track_id))
    }


    return (
        <>
            <div className="flex justify-center bg-[#DFE0E2]">
                <div className="flex flex-col max-w-12xl p-8 w-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden">
                    <div className="flex justify-between mb-2">
                        <h1 className="text-2xl font-bold">Your Credits</h1>
                    </div>
                    <p className="text-gray-500">Tracks you've made, produced, or have credits on</p>
                    <div className="my-6 grid grid-cols-4 gap-4">
                        <div className="flex gap-4 bg-white p-4 rounded-lg items-center max-w-3xl w-full shadow-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Disc2Icon color="#267082"/>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold">{data.length}</h1>
                                <p className="text-gray-500">Total Credits</p>
                            </div>
                        </div>
                        <div className="flex gap-4 bg-white p-4 rounded-lg items-center max-w-3xl w-full shadow-lg">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-5 h-5 text-[#1DB954]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold">1,000,000</h1>
                                <p className="text-gray-500">Spotify Streams</p>
                            </div>
                        </div>
                        <div className="flex gap-4 bg-white p-4 rounded-lg items-center max-w-3xl w-full shadow-lg">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold">1,000,000</h1>
                                <p className="text-gray-500">Youtube Views</p>
                            </div>
                        </div>
                        <div className="flex gap-4 bg-white p-4 rounded-lg items-center max-w-3xl w-full shadow-lg">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUpIcon color="#854bb4"/>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold">1,000,000</h1>
                                <p className="text-gray-500">Total Plays</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-6 items-center justify-center">
                            <input className="p-4 bg-white w-3/4 rounded-lg border-1 shadow-sm border-gray-200" placeholder="Search track, artist, album, or roles..."></input>
                            <div className="flex w-1/4 gap-4">
                                <button className="bg-white p-4 border-1 shadow-sm border-gray-200 rounded-lg w-full">Recently Added</button>
                            </div>
                        </div>
                    <div className="flex flex-col gap-4">
                        {data.map((track) => (
                            <Track 
                                key={track.id}
                                track_name={track.track_name} 
                                album_name={track.album_name} 
                                created_at={track.created_at} 
                                artist_name={track.artist_name}
                                popularity={track.popularity}
                                streams={track.spotify_streams_updated}
                                release_date={track.release_date}
                                image_url={track.image_url}
                                user_track_id={track.user_track_id}
                                youtube_streams={track.youtube_streams}
                                role={track.role}
                                notes={track.notes}
                                onDelete={handleTrackDeleted}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrackSection;

// create table public.user_tracks (
//     id bigint generated by default as identity not null,
//     created_at timestamp with time zone not null default now(),
//     track_id bigint not null,
//     user_id text not null,
//     constraint user_tracks_pkey primary key (id),
//     constraint user_tracks_track_id_fkey foreign KEY (track_id) references tracks (id)
//   ) TABLESPACE pg_default;

//   create table public.tracks (
//     id bigint generated by default as identity not null,
//     created_at timestamp with time zone not null default now(),
//     track_name text null,
//     popularity bigint null,
//     artist_name text null,
//     track_genre text null,
//     track_length bigint null,
//     track_id text not null default '1'::text,
//     album_name text null,
//     constraint tracks_pkey primary key (id)
//   ) TABLESPACE pg_default;

// create table public.track_streams (
//     id bigint generated by default as identity not null,
//     created_at timestamp with time zone not null default now(),
//     update_date date null,
//     song_id text null,
//     streams bigint null
//   ) TABLESPACE pg_default;
