import { useState } from "react"
import { createTrack } from "@/lib/database/tracks"
import { searchYoutubeVideo } from "@/services/YoutubeApi"

interface AddButtonProps {
    trackID: string
    artist: string
    albumName: string
    releaseDate: string
    trackName: string
    score: number
    spotify_url: string
    image_url: string
}

const AddButton = ({trackID, artist, albumName, releaseDate, trackName, score, spotify_url, image_url}: AddButtonProps) => {
    const [loading, setLoading] = useState(false)

    const handleAddTrack = async () => {
        try {
            setLoading(true)
            
            const result = await createTrack({
                trackID,
                artist,
                albumName,
                releaseDate,
                trackName,
                score,
                spotify_url,
                image_url
            })

            if (result.success) {
                // Use a toast library instead of alert
                alert(result.message)
            } else {
                alert(result.error)
            }
            
        } catch (error) {
            console.error('Error adding track:', error)
            alert('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleAddTrack}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? 'Adding...' : 'Add Track'}
        </button>
    )
}

export default AddButton