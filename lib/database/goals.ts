import { createClient } from "@/utils/supabase/client"

interface CreateGoalProps {
    goalType: string
    title: string
    description?: string
    periodType: string
    periodStart: string
    periodEnd: string
    progressSource: string
    target: number
}

export async function createGoal({
    goalType,
    title,
    description,
    periodType,
    periodStart,
    periodEnd,
    progressSource,
    target
}: CreateGoalProps) {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('Please sign in to create goals')
    }

    const { data, error } = await supabase
        .from('goals')
        .insert({
            user_id: user.id,
            goal_type: goalType,
            title,
            description: description || null,
            period_type: periodType,
            period_start: periodStart,
            period_end: periodEnd,
            progress_source: progressSource,
            target_value: target,
            updated_at: new Date().toISOString()
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating goal:', error)
        throw error
    }

    return data
}

export async function getUserGoals(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching goals:', error)
        throw error
    }

    return data
}

export async function updateGoal(goalId: string, updates: Partial<CreateGoalProps>) {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('Please sign in to update goals')
    }

    const { data, error } = await supabase
        .from('goals')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        console.error('Error updating goal:', error)
        throw error
    }

    return data
}

export async function deleteGoal(goalId: string) {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error('Please sign in to delete goals')
    }

    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting goal:', error)
        throw error
    }

    return true
}
