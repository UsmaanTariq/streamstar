import { createClient } from "@/utils/supabase/client"

export interface ProducerStats {
    totalStreams: {
        spotify: number
        youtube: number
        total: number
    }
    trackCount: number
    topTracks: Array<{
        track_name: string
        artist_name: string
        total_streams: number
        spotify_streams: number
        youtube_streams: number
    }>
}

export async function getProducerStats(userId: string) {
    const supabase = await createClient()

    const {data: userTracks} = await supabase.from('user_tracks').select('track_id').eq('user_id', userId)

    if (!userTracks || userTracks.length === 0) {
        return getEmptyStats()
    }

    const trackIds = userTracks.map(ut => ut.track_id)

    const {data: tracks} = await supabase
    .from('tracks')
    .select('*, track_streams(*)')
    .in('id', trackIds)

    if (!tracks) return getEmptyStats()

    return calculateStats(tracks)
    
}

function calculateStats(tracks: any[]): ProducerStats {
    let totalSpotify = 0
    let totalYoutube = 0
    let topTracksData: any[] = []

    tracks.forEach(track => {
        const latestStreams = track.track_streams?.[0] || 0
        const spotifyStreams = latestStreams.spotify_streams || 0
        const youtubeStreams = latestStreams.youtube_streams || 0

        totalSpotify += spotifyStreams
        totalYoutube += youtubeStreams

        topTracksData.push({
            track_name: track.track_name,
            artist_name: track.artist_name,
            total_streams: spotifyStreams + youtubeStreams,
            spotify_streams: spotifyStreams,
            youtube_streams: youtubeStreams
        })
    })

     // Sort and get top 5 tracks
     const topTracks = topTracksData
        .sort((a, b) => b.total_streams - a.total_streams)
        .slice(0, 5)
    
    return {
        totalStreams: {
            spotify: totalSpotify,
            youtube: totalYoutube,
            total: totalSpotify + totalYoutube
        },
        trackCount: tracks.length,
        topTracks: topTracks
    }
}

function getEmptyStats(): ProducerStats {
    return {
        totalStreams: {
            spotify: 0,
            youtube: 0,
            total: 0
        },
        trackCount: 0,
        topTracks: []
    }
}