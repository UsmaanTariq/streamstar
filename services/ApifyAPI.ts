export async function fetchTrackStreams(trackUrl: string) {
    const response = await fetch(`/api/apify/track-streams?url=${encodeURIComponent(trackUrl)}`)
    
    if (!response.ok) {
        throw new Error('Failed to fetch track streams')
    }
    
    const result = await response.json()
    return result.data
}