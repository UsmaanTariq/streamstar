import { updateGoalProgress } from "@/lib/database/goal_progress"

interface GoalsCardProps {
    title: string
    description: string
    periodStart: string
    periodEnd: string
    currentValue?: number
    targetValue?: number
    goalType?: string
}

const GoalsCard = ({
    title, 
    description, 
    periodStart, 
    periodEnd,
    currentValue = 0,
    targetValue = 100,
    goalType = ''
}: GoalsCardProps) => {
    // Calculate progress percentage
    const progressPercentage = targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0
    
    return (
        <div className="flex flex-col p-6 gap-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-all hover:scale-[1.02]">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            
            {description && (
                <p className="text-sm text-gray-600">{description}</p>
            )}
            
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-800">
                        {currentValue.toLocaleString()} / {targetValue.toLocaleString()}
                    </span>
                </div>
                
                {/* Progress Bar Container */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                
                {/* Percentage */}
                <div className="text-right">
                    <span className="text-xs font-semibold text-blue-600">
                        {progressPercentage.toFixed(1)}%
                    </span>
                </div>
            </div>
            
            {/* Date Range */}
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Start: {new Date(periodStart).toLocaleDateString()}</span>
                <span>End: {new Date(periodEnd).toLocaleDateString()}</span>
            </div>
        </div>
    )

}

export default GoalsCard