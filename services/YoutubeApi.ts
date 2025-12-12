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

export async function getYouTubeViews(videoId: string): Promise<number> {
  const baseUrl = getBaseUrl()
  const response = await fetch(`${baseUrl}/api/youtube/views?videoId=${videoId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube views')
  }
  
  const data = await response.json()
  return data.viewCount
}

export async function searchYoutubeVideo(track_name: string, artist_name: string): Promise<any> {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/youtube/search?track_name=${encodeURIComponent(track_name)}&artist_name=${encodeURIComponent(artist_name)}`)

    if (!response.ok){
        throw new Error('Failed to search YouTube video')
    }

    const data = await response.json()
    console.log("YouTube video found:", data)
    return data
}