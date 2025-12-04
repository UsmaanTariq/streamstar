export async function getYouTubeViews(videoId: string): Promise<number> {
  const response = await fetch(`/api/youtube/views?videoId=${videoId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube views')
  }
  
  const data = await response.json()
  return data.viewCount
}

export async function searchYoutubeVideo(track_name: string, artist_name: string): Promise<any> {
    const response = await fetch(`/api/youtube/search?track_name=${encodeURIComponent(track_name)}&artist_name=${encodeURIComponent(artist_name)}`)

    if (!response.ok){
        throw new Error('Failed to search YouTube video')
    }

    const data = await response.json()
    console.log("YouTube video found:", data)
    return data
}