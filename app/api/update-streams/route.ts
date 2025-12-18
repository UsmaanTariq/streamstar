import { NextResponse } from 'next/server'
import { updateAllTrackStreams } from '@/lib/database/track_streams'
import { createAdminClient } from '@/utils/supabase/server'

// Increase timeout for this route (Vercel Pro/Enterprise only)
export const maxDuration = 60 // seconds (requires paid plan)

export async function POST(request: Request) {
    try {
        // Optional: Add authentication check here
        // const authHeader = request.headers.get('authorization')
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        console.log('Starting stream update via API...')
        
        // Create admin client that bypasses RLS
        const adminClient = createAdminClient()
        
        // Add timeout wrapper
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Update timeout - consider processing in smaller batches')), 55000) // 55 seconds
        })

        const updatePromise = updateAllTrackStreams(adminClient)

        // Race between update and timeout
        const results = await Promise.race([updatePromise, timeoutPromise]) as any
        
        return NextResponse.json({
            success: true,
            message: 'Stream update completed',
            results,
            note: results.total > 20 ? 'Large dataset detected. Consider using background jobs for better reliability.' : undefined
        })
    } catch (error: any) {
        console.error('Stream update error:', error)
        
        // Check if it's a timeout error
        if (error.message.includes('timeout')) {
            return NextResponse.json({
                success: false,
                error: 'Update timed out. Try processing fewer tracks or upgrade to a paid plan.',
                suggestion: 'Consider implementing a queue system for large datasets'
            }, { status: 408 })
        }
        
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}