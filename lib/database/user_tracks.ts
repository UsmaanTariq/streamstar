import { createClient } from "@/utils/supabase/client";

export async function editUserTrack(user_track_id: number, role: string[], notes: string) {
    const supabase = createClient()
    
    console.log('Updating track:', user_track_id)

    // First, check if the row exists
    const { data: existingRow, error: selectError } = await supabase
        .from('user_tracks')
        .select('*')
        .eq('id', user_track_id)
        .single()

    if (selectError) {
        console.error('Row does not exist or no access:', selectError)
        return { 
            success: false, 
            error: 'Track not found or access denied' 
        }
    }

    console.log('Found existing row:', existingRow)

    // Now try to update
    const { data, error } = await supabase
        .from('user_tracks')
        .update({ 
            role: role,
            notes: notes
        })
        .eq('id', user_track_id)
        .select()
        // Remove .single() here!

    if (error) {
        console.error('Update error:', error)
        return { 
            success: false, 
            error: error.message 
        }
    }

    // Check if any rows were updated
    if (!data || data.length === 0) {
        console.error('No rows were updated - likely RLS policy issue')
        return {
            success: false,
            error: 'Update blocked - check permissions'
        }
    }

    console.log('Updated successfully:', data)
    return { 
        success: true, 
        message: "Track has been edited",
        data: data[0]  // Return first item
    }
}