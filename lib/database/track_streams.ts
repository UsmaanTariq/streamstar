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
    const {data: todayExisting} = await supabase.from('track_streams')
    .select('*')
    .eq('track_id', spotify_id)
    .eq('update_date', date)
    .maybeSingle()

    if (todayExisting) {
        console.log('Stream data already exists for today')
        return todayExisting
    } else 
    {
        // Fetch stream data with error handling
        let youtubeStreams = 0
        let spotifyStreams = 0

        try {
            youtubeStreams = await getYouTubeViews(youtube_url)
        } catch (error) {
            console.error('Failed to fetch YouTube views:', error)
            // Continue with 0 instead of failing
        }

        try {
            const spotifyData = await fetchTrackStreams(spotify_url)
            spotifyStreams = spotifyData?.streamCount || 0
        } catch (error) {
            console.error('Failed to fetch Spotify streams:', error)
            // Continue with 0 instead of failing
        }
        
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
}