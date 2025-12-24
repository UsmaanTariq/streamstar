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
        image_url: string
    }>
    streamsByRole: Array<{
        role: string
        total_streams: number
        spotify_streams: number
        youtube_streams: number
        track_count: number
    }>
    streamsByDate: Array<{
        date: string
        total_streams: number
        spotify_streams: number
        youtube_streams: number
    }>
    streamsByArtist: Array<{
        artist: string
        total_streams: number
        spotify_streams: number
        youtube_streams: number
        track_count: number
    }>
}

export async function getProducerStats(userId: string) {
    const supabase = await createClient()

    const {data: userTracks} = await supabase.from('user_tracks').select('track_id, role').eq('user_id', userId)

    if (!userTracks || userTracks.length === 0) {
        return getEmptyStats()
    }

    const trackIds = userTracks.map(ut => ut.track_id)

    // Get tracks with all their stream data
    const {data: tracks} = await supabase
    .from('tracks')
    .select('*, track_streams(*)')
    .in('id', trackIds)

    if (!tracks) return getEmptyStats()

    // Get track_streams for the past 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

    // Get track IDs from tracks table to query track_streams by track_id (Spotify ID)
    const trackSpotifyIds = tracks.map(t => t.track_id)

    const {data: recentStreams} = await supabase
        .from('track_streams')
        .select('*')
        .in('track_id', trackSpotifyIds)
        .gte('update_date', sevenDaysAgoStr)
        .order('update_date', { ascending: true })

    return calculateStats(tracks, userTracks, recentStreams || [])
    
}

function calculateStats(tracks: any[], userTracks: any[], recentStreams: any[]): ProducerStats {
    let totalSpotify = 0
    let totalYoutube = 0
    let topTracksData: any[] = []
    
    // Map to aggregate streams by role
    const roleStreamsMap = new Map<string, { 
        spotify: number, 
        youtube: number, 
        trackCount: number 
    }>()

    // Map to aggregate streams by date
    const dateStreamsMap = new Map<string, {
        spotify: number,
        youtube: number
    }>()

    const artistStreamsMap = new Map<string, {
        spotify: number,
        youtube: number,
        trackCount: number
    }
    >()

    tracks.forEach(track => {
        const sortedStreams = track.track_streams && track.track_streams.length > 0
            ? [...track.track_streams].sort((a: any, b: any) => 
                new Date(b.update_date || b.created_at).getTime() - new Date(a.update_date || a.created_at).getTime()
              )
            : []
        
        const latestStreams = sortedStreams[0] || null
        const spotifyStreams = latestStreams?.spotify_streams || 0
        const youtubeStreams = latestStreams?.youtube_streams || 0

        totalSpotify += spotifyStreams
        totalYoutube += youtubeStreams

        topTracksData.push({
            track_name: track.track_name,
            artist_name: track.artist_name,
            total_streams: spotifyStreams + youtubeStreams,
            spotify_streams: spotifyStreams,
            youtube_streams: youtubeStreams,
            image_url: track.image_url
        })

        // Find corresponding user_track to get roles
        const userTrack = userTracks.find(ut => ut.track_id === track.id)
        if (userTrack && userTrack.role) {
            const roles = Array.isArray(userTrack.role) ? userTrack.role : [userTrack.role]
            
            // Add streams to each role
            roles.forEach((role: string) => {
                if (!role) return
                
                const existing = roleStreamsMap.get(role) || { 
                    spotify: 0, 
                    youtube: 0, 
                    trackCount: 0 
                }
                
                roleStreamsMap.set(role, {
                    spotify: existing.spotify + spotifyStreams,
                    youtube: existing.youtube + youtubeStreams,
                    trackCount: existing.trackCount + 1
                })
            })
        }

        const artist = track.artist_name
        const artistExisting = artistStreamsMap.get(artist) || { 
            spotify: 0, 
            youtube: 0, 
            trackCount: 0 
        }

        artistStreamsMap.set(artist, {
            spotify: artistExisting.spotify + spotifyStreams,
            youtube: artistExisting.youtube + youtubeStreams,
            trackCount: artistExisting.trackCount + 1
        })
    })

    // Process streams by date (past 7 days)
    recentStreams.forEach(stream => {
        const date = stream.update_date
        const spotifyStreams = stream.spotify_streams || 0
        const youtubeStreams = stream.youtube_streams || 0

        const existing = dateStreamsMap.get(date) || {
            spotify: 0,
            youtube: 0
        }

        dateStreamsMap.set(date, {
            spotify: existing.spotify + spotifyStreams,
            youtube: existing.youtube + youtubeStreams
        })
    })

    // Convert date streams map to array and sort by date
    const streamsByDate = Array.from(dateStreamsMap.entries())
        .map(([date, data]) => ({
            date,
            total_streams: data.spotify + data.youtube,
            spotify_streams: data.spotify,
            youtube_streams: data.youtube
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Fill in missing dates with 0 streams (for complete 7-day timeline)
    const filledStreamsByDate = fillMissingDates(streamsByDate)

    // Sort and get top 5 tracks
    const topTracks = topTracksData
        .sort((a, b) => b.total_streams - a.total_streams)
        .slice(0, 5)
    
    // Convert role streams map to array and sort by total streams
    const streamsByRole = Array.from(roleStreamsMap.entries())
        .map(([role, data]) => ({
            role,
            total_streams: data.spotify + data.youtube,
            spotify_streams: data.spotify,
            youtube_streams: data.youtube,
            track_count: data.trackCount
        }))
        .sort((a, b) => b.total_streams - a.total_streams)
    
    const streamsByArtist = Array.from(artistStreamsMap.entries())
        .map(([artist, data]) => ({
            artist,
            total_streams: data.spotify + data.youtube,
            spotify_streams: data.spotify,
            youtube_streams: data.youtube,
            track_count: data.trackCount
        }))
        .sort((a, b) => b.total_streams - a.total_streams)

    return {
        totalStreams: {
            spotify: totalSpotify,
            youtube: totalYoutube,
            total: totalSpotify + totalYoutube
        },
        trackCount: tracks.length,
        topTracks: topTracks,
        streamsByRole: streamsByRole,
        streamsByDate: filledStreamsByDate,
        streamsByArtist: streamsByArtist
    }
}

// Helper function to fill in missing dates in the past 7 days
function fillMissingDates(streamsByDate: Array<{
    date: string
    total_streams: number
    spotify_streams: number
    youtube_streams: number
}>): Array<{
    date: string
    total_streams: number
    spotify_streams: number
    youtube_streams: number
}> {
    const result: Array<{
        date: string
        total_streams: number
        spotify_streams: number
        youtube_streams: number
    }> = []

    const today = new Date()
    const existingDatesMap = new Map(streamsByDate.map(s => [s.date, s]))

    // Generate past 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const existing = existingDatesMap.get(dateStr)
        result.push(existing || {
            date: dateStr,
            total_streams: 0,
            spotify_streams: 0,
            youtube_streams: 0
        })
    }

    return result
}

function getEmptyStats(): ProducerStats {
    return {
        totalStreams: {
            spotify: 0,
            youtube: 0,
            total: 0
        },
        trackCount: 0,
        topTracks: [],
        streamsByRole: [],
        streamsByDate: [],
        streamsByArtist: []
    }
}