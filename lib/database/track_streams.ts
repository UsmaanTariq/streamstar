// implement streams fethcing logic
import { fetchTrackStreams } from "@/services/ApifyAPI"
import { getYouTubeViews } from "@/services/YoutubeApi"
import { createClient } from "@/utils/supabase/client"
import { getCurrentDateFormatted } from "@/helper/helperFunctions"

export async function addTrackStreams({
    spotify_id, 
    spotify_url, 
    youtube_url
}: {
    spotify_id: string
    spotify_url: string
    youtube_url: string
}) {
    const supabase = createClient()  

    const date = getCurrentDateFormatted();
    const {data: todayExisting} = await supabase.from('track_streams')
    .select('*')
    .eq('track_id', spotify_id)
    .eq('update_date', date)
    .maybeSingle()

    if (todayExisting) {
        console.log('Stream data already exists for today')
        return todayExisting
    } else 
    {
        // Fetch stream data with error handling
        let youtubeStreams = 0
        let spotifyStreams = 0

        try {
            youtubeStreams = await getYouTubeViews(youtube_url)
        } catch (error) {
            console.error('Failed to fetch YouTube views:', error)
            // Continue with 0 instead of failing
        }

        try {
            const spotifyData = await fetchTrackStreams(spotify_url)
            spotifyStreams = spotifyData?.streamCount || 0
        } catch (error) {
            console.error('Failed to fetch Spotify streams:', error)
            // Continue with 0 instead of failing
        }
        
        const { data, error } = await supabase
            .from('track_streams')
            .insert({
                update_date: date,
                track_id: spotify_id,
                spotify_streams: spotifyStreams,
                youtube_streams: youtubeStreams
            })
            .select()           
            .single()            
        
        if (error) {
            console.error('Error creating track streams:', error)
            throw error          
        }
        return data
    }      
}

export async function updateAllTrackStreams() {
    const supabase = createClient()
    
    console.log('Starting bulk track streams update...')
    
    // Get all unique tracks from the tracks table
    const { data: tracks, error: tracksError } = await supabase
        .from('tracks')
        .select('track_id')
    
    if (tracksError || !tracks) {
        console.error('Error fetching tracks:', tracksError)
        throw new Error('Failed to fetch tracks')
    }

    if (tracks.length === 0) {
        console.log('No tracks found to update')
        return { success: 0, failed: 0, skipped: 0, total: 0 }
    }

    console.log(`Found ${tracks.length} tracks to update`)

    const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        total: tracks.length,
        errors: [] as Array<{ track_id: string; error: string }>
    }

    // Process each track
    for (const track of tracks) {
        try {
            // Get track links for this track
            const { data: trackLinks, error: linksError } = await supabase
                .from('track_links')
                .select('*')
                .eq('spotify_id', track.track_id)
                .maybeSingle()

            if (linksError) {
                console.error(`Error fetching links for ${track.track_id}:`, linksError)
                results.failed++
                results.errors.push({ 
                    track_id: track.track_id, 
                    error: 'Failed to fetch track links' 
                })
                continue
            }

            if (!trackLinks || !trackLinks.spotify_url || !trackLinks.youtube_url) {
                console.log(`Skipping ${track.track_id} - missing links`)
                results.skipped++
                continue
            }

            // Update streams for this track
            await addTrackStreams({
                spotify_id: track.track_id,
                spotify_url: trackLinks.spotify_url,
                youtube_url: trackLinks.youtube_url
            })

            console.log(`✅ Updated streams for ${track.track_id}`)
            results.success++

        } catch (error: any) {
            console.error(`❌ Error updating ${track.track_id}:`, error)
            results.failed++
            results.errors.push({ 
                track_id: track.track_id, 
                error: error.message || 'Unknown error' 
            })
        }
    }

    console.log('Bulk update completed:', results)
    return results
}