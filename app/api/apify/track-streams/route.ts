import { NextResponse } from 'next/server'
import { ApifyClient } from 'apify-client'

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
})

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const trackUrl = searchParams.get('url')

        if (!trackUrl) {
            return NextResponse.json({ error: 'Track URL is required' }, { status: 400 })
        }

        const input = {
            "urls": [
                {
                    "url": trackUrl
                }
            ],
            "followAlbums": false,
            "followSingles": false,
            "followPopularReleases": false
        }

        const run = await client.actor("YZhD6hYc8daYSWXKs").call(input)
        const { items } = await client.dataset(run.defaultDatasetId).listItems()

        return NextResponse.json({ data: items[0] || null })
    } catch (error) {
        console.error('Apify error:', error)
        return NextResponse.json({ error: 'Failed to fetch track streams' }, { status: 500 })
    }
}