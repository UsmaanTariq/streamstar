import { createClient } from "@/utils/supabase/client"; 
import { searchYoutubeVideo } from "@/services/YoutubeApi";
import { createTrackLinks } from "./track_links";
import { addTrackStreams } from "./track_streams";

interface TrackProps {
    trackID: string
    artist: string
    albumName: string
    releaseDate: string
    trackName: string
    score: number
    spotify_url: string
    image_url: string
    role: string[]
    notes?: string
}

export async function createTrack({trackID, artist, albumName, releaseDate, trackName, score, image_url, spotify_url, role, notes} : TrackProps) {
    try {
        const supabase = createClient()
        const {data: {user}, error: userError} = await supabase.auth.getUser()

        if (userError || !user) {
            console.error('User not authenticated:', userError)
            return { success: false, error: 'Please sign in to add tracks' }
        }

        const {data: checkData, error: checkError} = await supabase.from("tracks").select("*").eq("track_id", trackID).maybeSingle();

        if (checkData) {
            console.log("Track already on system - adding to user collection and updating streams")
            
            // Add track to user's collection
            const {error: userTrackError} = await supabase.from('user_tracks').insert([{
                user_id: user.id, 
                track_id: checkData.id,
                role: role,
                notes: notes || null
            }])

            if (userTrackError) {
                console.error('Error relating to user: ', userTrackError)
                return { success: false, error: 'Failed to add track to your collection' }
            }

            // Get track links to find YouTube URL
            const {data: trackLinks} = await supabase
                .from('track_links')
                .select('*')
                .eq('spotify_id', trackID)
                .maybeSingle()

            // Update stream data if we have the links
            if (trackLinks && trackLinks.youtube_url) {
                try {
                    const streamData = await addTrackStreams({
                        spotify_id: trackID,
                        spotify_url: spotify_url,
                        youtube_url: trackLinks.youtube_url
                    })
                    console.log('Stream data updated:', streamData)
                } catch (streamError) {
                    console.error('Error updating track streams:', streamError)
                    // Don't fail - user still added track to collection
                }
            } else {
                console.log('No track links found - skipping stream update')
            }
            
            return { success: true, message: 'Track added to your collection!' }
        } else {
            // Save track first (streams will be added separately)
            const {data: uploadedTrack, error } = await supabase.from("tracks").insert([{
                track_id: trackID,
                artist_name: artist,
                album_name: albumName,
                track_name: trackName,
                popularity: score,
                image_url: image_url,
                release_date: releaseDate
            }]).select().single()

            if (error || !uploadedTrack) {
                console.log('Error saving track: ', error)
                return { success: false, error: 'Failed to save track' }
            }

            console.log("Track saved successfully!")
            
            // Search for YouTube video
            const youtube = await searchYoutubeVideo(trackName, artist)
            
            // Validate YouTube data
            if (!youtube || !youtube.videoId) {
                console.error('YouTube video not found')
                // Continue without YouTube data
            } else {
                // Create track links with YouTube
                try {
                    const trackLinks = await createTrackLinks({
                        spotify_id: trackID,
                        spotify_url: spotify_url,
                        youtube_url: youtube.videoId
                    })
                    console.log("Track links created successfully!")
                } catch (linkError) {
                    console.error('Error creating track links:', linkError)
                    // Continue even if links fail - track is already saved
                }

                // Add stream data
                try {
                    const addStreams = await addTrackStreams({
                        spotify_id: trackID,
                        spotify_url: spotify_url,
                        youtube_url: youtube.videoId
                    })
                    console.log('Stream data added:', addStreams)
                } catch (streamError) {
                    console.error('Error adding track streams:', streamError)
                    // Continue even if streams fail - track is already saved
                }
            }

            
            const {error: userTrackError} = await supabase.from('user_tracks').insert([{
                user_id: user.id, 
                track_id: uploadedTrack.id,
                role: role,
                notes: notes || null
            }])

            if (userTrackError) {
                console.error('Error relating to user: ', userTrackError)
                return { success: false, error: 'Track saved but failed to add to your collection' }
            }
            
            return { success: true, message: 'Track added to your collection!' }
        }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}