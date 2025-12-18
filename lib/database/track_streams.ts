// implement streams fethcing logic
import { fetchTrackStreams } from "@/services/ApifyAPI"
import { getYouTubeViews } from "@/services/YoutubeApi"
import { createClient } from "@/utils/supabase/client"
import { getCurrentDateFormatted } from "@/helper/helperFunctions"

export async function addTrackStreams({
    spotify_id, 
    spotify_url, 
    youtube_url,
    supabaseClient
}: {
    spotify_id: string
    spotify_url: string
    youtube_url: string
    supabaseClient?: any
}) {
    const supabase = supabaseClient || createClient()  

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

// Helper function to process tracks in parallel batches
async function processBatch(
    tracks: any[],
    supabase: any,
    batchSize: number = 5
) {
    const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: [] as Array<{ track_id: string; error: string }>
    }

    // Process tracks in batches for better performance
    for (let i = 0; i < tracks.length; i += batchSize) {
        const batch = tracks.slice(i, i + batchSize)
        
        // Process this batch in parallel
        const batchPromises = batch.map(async (track) => {
            try {
                // Get track links for this track
                const { data: trackLinks, error: linksError } = await supabase
                    .from('track_links')
                    .select('*')
                    .eq('spotify_id', track.track_id)
                    .maybeSingle()

                if (linksError) {
                    console.error(`Error fetching links for ${track.track_id}:`, linksError)
                    return { status: 'failed', track_id: track.track_id, error: 'Failed to fetch track links' }
                }

                if (!trackLinks || !trackLinks.spotify_url || !trackLinks.youtube_url) {
                    console.log(`Skipping ${track.track_id} - missing links`)
                    return { status: 'skipped', track_id: track.track_id }
                }

                // Update streams for this track
                await addTrackStreams({
                    spotify_id: track.track_id,
                    spotify_url: trackLinks.spotify_url,
                    youtube_url: trackLinks.youtube_url,
                    supabaseClient: supabase
                })

                console.log(`✅ Updated streams for ${track.track_id}`)
                return { status: 'success', track_id: track.track_id }

            } catch (error: any) {
                console.error(`❌ Error updating ${track.track_id}:`, error)
                return { 
                    status: 'failed', 
                    track_id: track.track_id, 
                    error: error.message || 'Unknown error' 
                }
            }
        })

        // Wait for this batch to complete
        const batchResults = await Promise.allSettled(batchPromises)
        
        // Aggregate results
        batchResults.forEach((result) => {
            if (result.status === 'fulfilled') {
                const value = result.value
                if (value.status === 'success') {
                    results.success++
                } else if (value.status === 'failed') {
                    results.failed++
                    results.errors.push({ track_id: value.track_id, error: value.error })
                } else if (value.status === 'skipped') {
                    results.skipped++
                }
            } else {
                results.failed++
            }
        })

        console.log(`Batch ${Math.floor(i / batchSize) + 1} completed: ${results.success} success, ${results.failed} failed, ${results.skipped} skipped`)
    }

    return results
}

export async function updateAllTrackStreams(supabaseClient?: any) {
    const supabase = supabaseClient || createClient()
    
    console.log('Starting bulk track streams update...')
    
    // Get all unique tracks with their links in a single query (optimization)
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

    // Process tracks in parallel batches (5 at a time to avoid rate limits)
    const results = await processBatch(tracks, supabase, 5)

    const finalResults = {
        ...results,
        total: tracks.length
    }

    console.log('Bulk update completed:', finalResults)
    return finalResults
}