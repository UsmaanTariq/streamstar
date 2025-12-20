'use client'

import { useState } from "react"
import { updateGoalProgress } from "@/lib/database/goal_progress"
import { useUserGoals } from "@/hooks/useUserGoals"

const RefreshGoals = () => {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { user, userGoals, refetch } = useUserGoals()

    const handleRefreshAll = async () => {
        if (!user?.id || !userGoals) return
        
        setIsRefreshing(true)
        try {
            // Update progress for all goals
            const updatePromises = userGoals.map((goal: any) => 
                updateGoalProgress(goal.id, user.id)
            )
            
            await Promise.all(updatePromises)
            
            // Refetch goals to get updated data
            await refetch()
            
            console.log('All goals refreshed successfully')
        } catch (error) {
            console.error('Failed to refresh goals:', error)
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <button 
            className="bg-green-500 text-white font-bold rounded py-2 px-3 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleRefreshAll}
            disabled={isRefreshing || !userGoals || userGoals.length === 0}
        >
            {isRefreshing ? 'Refreshing...' : 'Refresh All Goals'}
        </button>
    )
}

export default RefreshGoals