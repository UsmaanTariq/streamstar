import { createClient } from "@/utils/supabase/client";

const DeleteButton = ({user_track_id}: {user_track_id: number}) => {
    const handleDelete = async () => {
        console.log('Deleting user_track_id:', user_track_id)
        
        if (!user_track_id) {
            console.error('user_track_id is undefined!')
            alert('Cannot delete: missing track ID')
            return
        }

        const supabase = createClient()
        const {error} = await supabase.from('user_tracks').delete().eq('id', user_track_id)

        if (error) {
            console.log("Error deleting: ", error)
        } else {
            console.log("Track deleted succesfully")
            window.location.reload()
        }
    }
    return (
        <button className='p-2 rounded-lg hover:bg-red-100 transition-colors' onClick={handleDelete}>
            <svg className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    )
}

export default DeleteButton;