import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const apikey = process.env.YOUTUBE_API_KEY

        if (!apikey) {
            console.error('YOUTUBE_API_KEY is not set')
            return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 })
        }

        const { searchParams } = new URL(request.url)

        const track_name = searchParams.get('track_name')
        const artist_name = searchParams.get('artist_name') 
        
        if (!track_name || !artist_name) {
            return NextResponse.json({ error: 'Track name and artist name required' }, { status: 400 })
        }

        const searchQuery = `${artist_name} - ${track_name}`

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apikey}`
        const response = await fetch(url)

        if (!response.ok) {
            const error = await response.json()
            console.error('YouTube API error:', error)
            return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: response.status })
        }
        
        const data = await response.json()

        if (!data.items || data.items.length === 0) {
            return NextResponse.json({ error: 'No videos found' }, { status: 404 })
        }

        console.log('Found video:', data.items[0].snippet.title)

        // Get the first video only
        const video = data.items[0]
        
        return NextResponse.json({
            videoId: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
            channelTitle: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt
        })

    } catch (error: any) {
        console.error('YouTube search error:', error.message || error)
        return NextResponse.json({ 
            error: 'Failed to search YouTube',
            details: error.message || 'Unknown error'
        }, { status: 500 })
    }
}