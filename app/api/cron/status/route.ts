import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'

export async function GET() {
    try {
        const supabase = createAdminClient()
        const today = new Date().toISOString().split('T')[0]

        // Get total tracks count
        const { count: totalTracks } = await supabase
            .from('tracks')
            .select('*', { count: 'exact', head: true })

        // Get tracks updated today
        const { data: updatedToday, error: updatedError } = await supabase
            .from('track_streams')
            .select('track_id, spotify_streams, youtube_streams, update_date')
            .eq('update_date', today)

        if (updatedError) {
            throw updatedError
        }

        const updatedCount = updatedToday?.length || 0
        const remainingCount = (totalTracks || 0) - updatedCount
        const progressPercentage = totalTracks 
            ? Math.round((updatedCount / totalTracks) * 100) 
            : 0

        // Calculate estimated time to complete
        // Assuming 3 tracks every 15 minutes
        const tracksPerRun = 3
        const minutesBetweenRuns = 15
        const runsNeeded = Math.ceil(remainingCount / tracksPerRun)
        const estimatedMinutes = runsNeeded * minutesBetweenRuns

        return NextResponse.json({
            date: today,
            totalTracks: totalTracks || 0,
            updatedToday: updatedCount,
            remaining: remainingCount,
            progress: `${progressPercentage}%`,
            estimatedTimeToComplete: remainingCount > 0 
                ? `~${estimatedMinutes} minutes (${runsNeeded} more runs)`
                : 'Complete!',
            status: remainingCount === 0 ? 'complete' : 'in_progress',
            recentUpdates: updatedToday?.slice(0, 5).map(t => ({
                track_id: t.track_id,
                spotify: t.spotify_streams,
                youtube: t.youtube_streams
            })) || []
        })

    } catch (error: any) {
        console.error('Status check error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error'
        }, { status: 500 })
    }
}

