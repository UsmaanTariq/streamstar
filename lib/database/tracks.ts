import { createClient } from "@/utils/supabase/client"; 
import { fetchTrackStreams } from "@/services/ApifyAPI";
import { searchYoutubeVideo } from "@/services/YoutubeApi";
import { createTrackLinks } from "./track_links";
import { addTrackStreams } from "./track_streams";
import { youtube } from "googleapis/build/src/apis/youtube";

interface TrackProps {
    trackID: string
    artist: string
    albumName: string
    releaseDate: string
    trackName: string
    score: number
    spotify_url: string
    image_url: string
}

export async function createTrack({trackID, artist, albumName, releaseDate, trackName, score, image_url, spotify_url} : TrackProps) {
    try {
        const supabase = createClient()
        const {data: {user}, error: userError} = await supabase.auth.getUser()

        if (userError || !user) {
            console.error('User not authenticated:', userError)
            return { success: false, error: 'Please sign in to add tracks' }
        }

        const {data: checkData, error: checkError} = await supabase.from("tracks").select("*").eq("track_id", trackID).maybeSingle();

        if (checkData) {
            console.log("Track on system")
            const {error: userTrackError} = await supabase.from('user_tracks').insert([{
                user_id: user.id, 
                track_id: checkData.id
            }])

            if (userTrackError) {
                console.error('Error relating to user: ', userTrackError)
                return { success: false, error: 'Failed to add track to your collection' }
            }
            
            return { success: true, message: 'Track added to your collection!' }
        } else {
            const streamData = await fetchTrackStreams(spotify_url)
            console.log('Stream data:', streamData)

            const {data: uploadedTrack, error } = await supabase.from("tracks").insert([{
                track_id: trackID,
                artist_name: artist,
                album_name: albumName,
                track_name: trackName,
                popularity: score,
                spotify_streams: streamData.streamCount,
                image_url: image_url,
                release_date: releaseDate
            }]).select().single()

            if (error || !uploadedTrack) {
                console.log('Error saving track: ', error)
                return { success: false, error: 'Failed to save track' }
            }

            console.log("Track saved successfully!")
            const youtube = await searchYoutubeVideo(trackName, artist)
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

            try {
                const addStreams = await addTrackStreams({
                    spotify_id: trackID,
                    spotify_url: spotify_url,
                    youtube_url: youtube.videoId
                })
                console.log(addStreams)

            } catch (error) {
                console.error('Error adding track streams:', error)
            }

            
            const {error: userTrackError} = await supabase.from('user_tracks').insert([{
                user_id: user.id, 
                track_id: uploadedTrack.id
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