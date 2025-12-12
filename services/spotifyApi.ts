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

export async function getSpotifyToken() {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/spotify/token`)
    if (!response.ok) throw new Error('Failed to get token')
    const data = await response.json()
    console.log(data)
    return data.access_token
}

export async function searchArtist(artistName: string) {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/spotify/search-artist?name=${encodeURIComponent(artistName)}`)
    if (!response.ok) throw new Error('Failed to search artist')
    const data = await response.json()
    console.log(data)
    return data.artists
}

export async function searchTrack(trackName: string) {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/spotify/search-track?name=${encodeURIComponent(trackName)}`)
    if (!response.ok) throw new Error('Failed to search track')
    const data = await response.json()
    return data.tracks
}

export async function getArtistTracks(artistId: string) {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/spotify/artist-tracks?id=${artistId}`)
    if (!response.ok) throw new Error('Failed to get artist tracks')
    const data = await response.json()
    return data
}

const _getGenres = async (token: string) => {
    const result = await fetch('https://api.spotify.com/v1/browse/categories', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json()
    return data.categories.items;
}