import { NextResponse } from 'next/server'
import { updateAllTrackStreams } from '@/lib/database/track_streams'

export async function POST(request: Request) {
    try {
        // Optional: Add authentication check here
        const results = await updateAllTrackStreams()
        
        return NextResponse.json({
            success: true,
            message: 'Stream update completed',
            results
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}