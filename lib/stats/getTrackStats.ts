import { createClient } from "@/utils/supabase/client"

export interface IndividualTrackStats {
    trackId: string
    trackName: string
    artistName: string
    albumName: string
    imageUrl: string
    releaseDate: string
    role: string[]
    totalStreams: number
    spotifyStreams: number
    youtubeStreams: number
    popularity: number
    streamHistory: Array<{
        date: string
        spotifyStreams: number
        youtubeStreams: number
        totalStreams: number
    }>
}

export interface AllTracksStats {
    tracks: IndividualTrackStats[]
    totalTracks: number
} 

export async function getAllUserTracksStats(userId: string): Promise<AllTracksStats> {
    const supabase = createClient()
    
    // Get user's tracks with roles
    const { data: userTracks } = await supabase
        .from('user_tracks')
        .select('track_id, role')
        .eq('user_id', userId)
    
    if (!userTracks || userTracks.length === 0) {
        return { tracks: [], totalTracks: 0 }
    }
    
    const trackIds = userTracks.map(ut => ut.track_id)
    
    // Get full track data with stream history
    const { data: tracks } = await supabase
        .from('tracks')
        .select('*, track_streams(*)')
        .in('id', trackIds)
    
    if (!tracks) {
        return { tracks: [], totalTracks: 0 }
    }
    
    // Process each track
    const processedTracks: IndividualTrackStats[] = tracks.map(track => {
        const userTrack = userTracks.find(ut => ut.track_id === track.id)
        
        // Sort streams by date
        const sortedStreams = track.track_streams && track.track_streams.length > 0
            ? [...track.track_streams].sort((a: any, b: any) => 
                new Date(b.update_date || b.created_at).getTime() - 
                new Date(a.update_date || a.created_at).getTime()
              )
            : []
        // Get latest streams
        const latestStreams = sortedStreams[0] || null
        const spotifyStreams = latestStreams?.spotify_streams || 0
        const youtubeStreams = latestStreams?.youtube_streams || 0
        
        // Build stream history
        const streamHistory = sortedStreams.map(stream => ({
            date: stream.update_date || stream.created_at,
            spotifyStreams: stream.spotify_streams || 0,
            youtubeStreams: stream.youtube_streams || 0,
            totalStreams: (stream.spotify_streams || 0) + (stream.youtube_streams || 0)
        })).reverse() // Oldest to newest for charts
        
        return {
            trackId: track.track_id,
            trackName: track.track_name,
            artistName: track.artist_name,
            albumName: track.album_name,
            imageUrl: track.image_url,
            releaseDate: track.release_date,
            role: userTrack?.role || [],
            totalStreams: spotifyStreams + youtubeStreams,
            spotifyStreams,
            youtubeStreams,
            popularity: track.popularity || 0,
            streamHistory
        }
    })
    
    // Sort by total streams descending
    processedTracks.sort((a, b) => b.totalStreams - a.totalStreams)
    
    return {
        tracks: processedTracks,
        totalTracks: processedTracks.length
    }
}