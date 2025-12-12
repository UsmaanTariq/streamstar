import { createClient } from "@/utils/supabase/client"

export async function createTrackLinks({
    spotify_id, 
    spotify_url, 
    youtube_url
}: {
    spotify_id: string
    spotify_url: string
    youtube_url: string
}) {
    const supabase = createClient()  

    const { data: existing } = await supabase
        .from('track_links')
        .select('*')
        .eq('spotify_id', spotify_id)
        .maybeSingle()
    
    if (existing) {
        return existing
    } else 
    {
        const { data, error } = await supabase
        .from('track_links')
        .insert({
            spotify_id,      
            spotify_url,
            youtube_url
        })
        .select()           
        .single()            
    
        if (error) {
            console.error('Error creating track links:', error)
            throw error          
        }
        
        return data       
    }         
}