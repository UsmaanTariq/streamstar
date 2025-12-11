// implement streams fethcing logic
import { fetchTrackStreams } from "@/services/ApifyAPI"
import { getYouTubeViews } from "@/services/YoutubeApi"
import { createClient } from "@/utils/supabase/client"
import { getCurrentDateFormatted } from "@/helper/helperFunctions"

export async function addTrackStreams({
    spotify_id, 
    spotify_url, 
    youtube_url
}: {
    spotify_id: string
    spotify_url: string
    youtube_url: string
}) {
    const supabase = createClient()  

    const date = getCurrentDateFormatted();

    const youtubeStreams = await getYouTubeViews(youtube_url)

    const spotifyData = await fetchTrackStreams(spotify_url)
    const spotifyStreams = spotifyData?.streamCount || 0
    
    const { data, error } = await supabase
        .from('track_streams')
        .insert({
            update_date: date,
            track_id: spotify_id,
            spotify_streams: spotifyStreams,
            youtube_streams: youtubeStreams
        })
        .select()           
        .single()            
    
    if (error) {
        console.error('Error creating track streams:', error)
        throw error          
    }
    
    return data              
}