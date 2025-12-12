// Helper to get the base URL for API calls
function getBaseUrl() {
    // Check if we're on the server
    if (typeof window === 'undefined') {
        // Server-side: use environment variable or default to localhost
        return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
    // Client-side: use relative URLs
    return ''
}

export async function fetchTrackStreams(trackUrl: string) {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/apify/track-streams?url=${encodeURIComponent(trackUrl)}`)
    
    if (!response.ok) {
        throw new Error('Failed to fetch track streams')
    }
    
    const result = await response.json()
    return result.data
}