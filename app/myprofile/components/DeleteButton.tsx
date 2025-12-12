import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const DeleteButton = ({
    user_track_id, 
    onDelete
}: {
    user_track_id: number
    onDelete?: (user_track_id: number) => void
}) => {
    const [isDeleting, setIsDeleting] = useState(false)
    
    const handleDelete = async () => {
        console.log('Deleting user_track_id:', user_track_id)
        
        if (!user_track_id) {
            console.error('user_track_id is undefined!')
            alert('Cannot delete: missing track ID')
            return
        }

        // Confirm deletion
        if (!confirm('Are you sure you want to remove this track from your collection?')) {
            return
        }

        setIsDeleting(true)
        const supabase = createClient()
        const {error} = await supabase.from('user_tracks').delete().eq('id', user_track_id)

        if (error) {
            console.error("Error deleting: ", error)
            alert('Failed to delete track. Please try again.')
            setIsDeleting(false)
        } else {
            console.log("Track deleted successfully")
            // Call the callback to update parent state
            if (onDelete) {
                onDelete(user_track_id)
            }
        }
    }
    return (
        <button 
            className='p-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed' 
            onClick={handleDelete}
            disabled={isDeleting}
            title="Remove from collection"
        >
            <svg className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    )
}

export default DeleteButton;