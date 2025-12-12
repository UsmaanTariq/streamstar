'use client'

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import { createClient } from "@/utils/supabase/client"
import Track from './Track'

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
                .select('id, track_id')
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
                
                // Get the latest track_streams entry (it's an array)
                const latestStreams = track.track_streams && track.track_streams.length > 0 
                    ? track.track_streams[0] 
                    : null
                
                return {
                    ...track,
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
            <div className="px-16 py-6 flex justify-center bg-[#DFE0E2]">
                <div className="flex flex-col max-w-7xl p-16 w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100  shadow-lg overflow-hidden">
                    <div className="flex justify-between mb-2">
                        <h1 className="text-2xl font-bold">Your Credits</h1>
                        <input placeholder="Search Bar" className="p-3 border-2 rounded-md border-gray-200"></input>
                        <button className="text-2xl px-4">Filter</button>
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