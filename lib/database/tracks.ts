import { createClient } from "@/utils/supabase/client";

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

export async function createTrack({trackID, artist, albumName, releaseDate, trackName, score, image_url} : TrackProps) {

}