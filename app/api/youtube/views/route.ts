import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY
        
        if (!apiKey) {
            console.error('YOUTUBE_API_KEY is not set')
            return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 })
        }

        const { searchParams } = new URL(request.url)
        const videoId = searchParams.get('videoId')

        if (!videoId) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
        }

        console.log('Fetching views for video:', videoId)

        const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`
        const response = await fetch(url)
        
        if (!response.ok) {
            const error = await response.json()
            console.error('YouTube API error:', error)
            return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: response.status })
        }

        const data = await response.json()
        
        if (!data.items || data.items.length === 0) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        }

        const stats = data.items[0].statistics
        console.log('Views:', stats.viewCount)

        return NextResponse.json({ 
            viewCount: parseInt(stats.viewCount),
            likeCount: parseInt(stats.likeCount || 0),
            commentCount: parseInt(stats.commentCount || 0)
        })
    } catch (error: any) {
        console.error('YouTube API error:', error.message || error)
        return NextResponse.json({ 
            error: 'Failed to fetch YouTube views',
            details: error.message || 'Unknown error'
        }, { status: 500 })
    }
}

