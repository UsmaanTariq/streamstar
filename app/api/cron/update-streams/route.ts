import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'
import { fetchTrackStreams } from '@/services/ApifyAPI'
import { getYouTubeViews } from '@/services/YoutubeApi'

// Vercel cron job - runs every 15 minutes
// Configure in vercel.json

export const maxDuration = 60 // Max 60 seconds on Vercel

// Number of tracks to process per cron run
const BATCH_SIZE = 3

export async function GET(request: Request) {
    try {
        // Verify cron secret for security (optional but recommended)
        const authHeader = request.headers.get('authorization')
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.log('Unauthorized cron request')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log(`[CRON] Starting batch stream update at ${new Date().toISOString()}`)
        
        const supabase = createAdminClient()
        const today = new Date().toISOString().split('T')[0]

        // Step 1: Get tracks that need updating (not updated today)
        // First, get all track IDs that have been updated today
        const { data: updatedToday, error: updatedError } = await supabase
            .from('track_streams')
            .select('track_id')
            .eq('update_date', today)

        if (updatedError) {
            console.error('[CRON] Error fetching updated tracks:', updatedError)
            throw updatedError
        }

        const updatedTrackIds = updatedToday?.map(t => t.track_id) || []
        console.log(`[CRON] ${updatedTrackIds.length} tracks already updated today`)

        // Step 2: Get tracks that haven't been updated today
        let tracksQuery = supabase
            .from('tracks')
            .select('id, track_id, track_name')
            .limit(BATCH_SIZE)

        // Only add the NOT IN filter if there are tracks updated today
        if (updatedTrackIds.length > 0) {
            // We need to get all tracks and filter manually since Supabase 
            // doesn't support NOT IN directly on text arrays easily
            const { data: allTracks, error: allTracksError } = await supabase
                .from('tracks')
                .select('id, track_id, track_name')

            if (allTracksError) {
                console.error('[CRON] Error fetching all tracks:', allTracksError)
                throw allTracksError
            }

            // Filter out tracks that were updated today
            const pendingTracks = allTracks?.filter(
                track => !updatedTrackIds.includes(track.track_id)
            ).slice(0, BATCH_SIZE) || []

            if (pendingTracks.length === 0) {
                console.log('[CRON] All tracks have been updated today! 🎉')
                return NextResponse.json({
                    success: true,
                    message: 'All tracks already updated today',
                    processed: 0,
                    remaining: 0,
                    totalUpdatedToday: updatedTrackIds.length
                })
            }

            // Process this batch
            const results = await processBatch(pendingTracks, supabase, today)
            
            const remainingCount = (allTracks?.length || 0) - updatedTrackIds.length - results.success
            
            return NextResponse.json({
                success: true,
                message: `Batch processed successfully`,
                ...results,
                remaining: Math.max(0, remainingCount),
                totalTracks: allTracks?.length || 0,
                nextRunIn: '15 minutes'
            })
        } else {
            // No tracks updated today, get first batch
            const { data: pendingTracks, error: tracksError } = await tracksQuery

            if (tracksError) {
                console.error('[CRON] Error fetching tracks:', tracksError)
                throw tracksError
            }

            if (!pendingTracks || pendingTracks.length === 0) {
                console.log('[CRON] No tracks found in database')
                return NextResponse.json({
                    success: true,
                    message: 'No tracks to update',
                    processed: 0
                })
            }

            // Get total count for progress tracking
            const { count: totalCount } = await supabase
                .from('tracks')
                .select('*', { count: 'exact', head: true })

            const results = await processBatch(pendingTracks, supabase, today)

            return NextResponse.json({
                success: true,
                message: `Batch processed successfully`,
                ...results,
                remaining: (totalCount || 0) - results.success,
                totalTracks: totalCount || 0,
                nextRunIn: '15 minutes'
            })
        }

    } catch (error: any) {
        console.error('[CRON] Stream update error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error'
        }, { status: 500 })
    }
}

async function processBatch(
    tracks: Array<{ id: number; track_id: string; track_name: string }>,
    supabase: any,
    today: string
) {
    const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        processed: [] as string[],
        errors: [] as Array<{ track_id: string; error: string }>
    }

    console.log(`[CRON] Processing batch of ${tracks.length} tracks...`)

    for (const track of tracks) {
        const startTime = Date.now()
        
        try {
            // Get track links (spotify_url and youtube_url)
            const { data: trackLinks, error: linksError } = await supabase
                .from('track_links')
                .select('spotify_url, youtube_url')
                .eq('spotify_id', track.track_id)
                .maybeSingle()

            if (linksError) {
                console.error(`[CRON] Error fetching links for ${track.track_id}:`, linksError)
                results.failed++
                results.errors.push({ track_id: track.track_id, error: 'Failed to fetch track links' })
                continue
            }

            if (!trackLinks?.spotify_url || !trackLinks?.youtube_url) {
                console.log(`[CRON] Skipping ${track.track_name} - missing URLs`)
                results.skipped++
                continue
            }

            // Double-check this track hasn't been updated (race condition protection)
            const { data: existingToday } = await supabase
                .from('track_streams')
                .select('id')
                .eq('track_id', track.track_id)
                .eq('update_date', today)
                .maybeSingle()

            if (existingToday) {
                console.log(`[CRON] Skipping ${track.track_name} - already updated`)
                results.skipped++
                continue
            }

            // Fetch streams from APIs
            let spotifyStreams = 0
            let youtubeStreams = 0

            try {
                const spotifyData = await fetchTrackStreams(trackLinks.spotify_url)
                spotifyStreams = spotifyData?.streamCount || 0
            } catch (error) {
                console.error(`[CRON] Spotify fetch failed for ${track.track_name}:`, error)
            }

            try {
                youtubeStreams = await getYouTubeViews(trackLinks.youtube_url)
            } catch (error) {
                console.error(`[CRON] YouTube fetch failed for ${track.track_name}:`, error)
            }

            // Insert the stream data
            const { error: insertError } = await supabase
                .from('track_streams')
                .insert({
                    track_id: track.track_id,
                    update_date: today,
                    spotify_streams: spotifyStreams,
                    youtube_streams: youtubeStreams
                })

            if (insertError) {
                console.error(`[CRON] Insert failed for ${track.track_name}:`, insertError)
                results.failed++
                results.errors.push({ track_id: track.track_id, error: insertError.message })
                continue
            }

            const elapsed = Date.now() - startTime
            console.log(`[CRON] ✅ Updated ${track.track_name} (Spotify: ${spotifyStreams}, YouTube: ${youtubeStreams}) in ${elapsed}ms`)
            
            results.success++
            results.processed.push(track.track_name)

        } catch (error: any) {
            console.error(`[CRON] Error processing ${track.track_name}:`, error)
            results.failed++
            results.errors.push({ track_id: track.track_id, error: error.message })
        }
    }

    console.log(`[CRON] Batch complete: ${results.success} success, ${results.failed} failed, ${results.skipped} skipped`)
    return results
}

