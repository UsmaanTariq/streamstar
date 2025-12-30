'use client'
import { useMemo } from 'react'

interface ProductionStreakGraphProps {
    tracks: Array<{
        release_date: string
        track_name?: string
    }>
    loading?: boolean
}

const ProductionStreakGraph = ({ tracks, loading }: ProductionStreakGraphProps) => {
    const currentYear = new Date().getFullYear()
    
    // Build a map of dates to track counts
    const productionDays = useMemo(() => {
        const dayMap = new Map<string, number>()
        
        tracks.forEach(track => {
            if (!track.release_date) return
            const date = new Date(track.release_date)
            if (date.getFullYear() === currentYear) {
                const dateKey = date.toISOString().split('T')[0]
                dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + 1)
            }
        })
        
        return dayMap
    }, [tracks, currentYear])

    // Generate all weeks of the year
    const weeks = useMemo(() => {
        const result: Array<Array<{ date: Date; dateKey: string; count: number }>> = []
        
        // Start from January 1st of current year
        const startDate = new Date(currentYear, 0, 1)
        // Adjust to start from the Sunday of that week
        const startDay = startDate.getDay()
        startDate.setDate(startDate.getDate() - startDay)
        
        const endDate = new Date(currentYear, 11, 31)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        let currentDate = new Date(startDate)
        let currentWeek: Array<{ date: Date; dateKey: string; count: number }> = []
        
        while (currentDate <= endDate || currentWeek.length > 0) {
            const dateKey = currentDate.toISOString().split('T')[0]
            const isCurrentYear = currentDate.getFullYear() === currentYear
            const isFuture = currentDate > today
            
            currentWeek.push({
                date: new Date(currentDate),
                dateKey,
                count: isCurrentYear && !isFuture ? (productionDays.get(dateKey) || 0) : -1
            })
            
            if (currentWeek.length === 7) {
                result.push(currentWeek)
                currentWeek = []
            }
            
            currentDate.setDate(currentDate.getDate() + 1)
            
            // Stop if we've gone past the year and completed the week
            if (currentDate.getFullYear() > currentYear && currentWeek.length === 0) {
                break
            }
        }
        
        // Add any remaining days
        if (currentWeek.length > 0) {
            result.push(currentWeek)
        }
        
        return result
    }, [currentYear, productionDays])

    // Get color based on count
    const getColor = (count: number) => {
        if (count === -1) return 'bg-transparent' // Future or outside year
        if (count === 0) return 'bg-neutral-100'
        if (count === 1) return 'bg-green-400'
        if (count === 2) return 'bg-green-600'
        return 'bg-neutral-900' // 3+ tracks
    }

    // Month labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    // Calculate month positions
    const monthPositions = useMemo(() => {
        const positions: Array<{ month: string; weekIndex: number }> = []
        let lastMonth = -1
        
        weeks.forEach((week, weekIndex) => {
            // Check the first day of the week that's in the current year
            const dayInYear = week.find(day => day.date.getFullYear() === currentYear)
            if (dayInYear) {
                const month = dayInYear.date.getMonth()
                if (month !== lastMonth) {
                    positions.push({ month: months[month], weekIndex })
                    lastMonth = month
                }
            }
        })
        
        return positions
    }, [weeks, currentYear])

    // Calculate stats
    const stats = useMemo(() => {
        const totalDays = productionDays.size
        const totalTracks = Array.from(productionDays.values()).reduce((sum, count) => sum + count, 0)
        
        // Calculate longest streak
        let longestStreak = 0
        let currentStreak = 0
        let lastDate: Date | null = null
        
        const sortedDates = Array.from(productionDays.keys()).sort()
        sortedDates.forEach(dateKey => {
            const date = new Date(dateKey)
            if (lastDate) {
                const diffDays = Math.round((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
                if (diffDays === 1) {
                    currentStreak++
                } else {
                    longestStreak = Math.max(longestStreak, currentStreak)
                    currentStreak = 1
                }
            } else {
                currentStreak = 1
            }
            lastDate = date
        })
        longestStreak = Math.max(longestStreak, currentStreak)
        
        return { totalDays, totalTracks, longestStreak }
    }, [productionDays])

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="animate-pulse">
                    <div className="h-5 bg-neutral-200 rounded w-48 mb-4"></div>
                    <div className="h-24 bg-neutral-100 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                    {currentYear} Production Activity
                </h3>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>{stats.totalTracks} release{stats.totalTracks !== 1 ? 's' : ''}</span>
                    <span>{stats.totalDays} active day{stats.totalDays !== 1 ? 's' : ''}</span>
                    {stats.longestStreak > 1 && (
                        <span className="text-neutral-700 font-medium">
                            🔥 {stats.longestStreak} day streak
                        </span>
                    )}
                </div>
            </div>

            {/* Month labels */}
            <div className="relative mb-1 ml-8">
                <div className="flex text-xs text-neutral-400" style={{ gap: '0px' }}>
                    {monthPositions.map(({ month, weekIndex }, i) => (
                        <span 
                            key={i}
                            className="absolute"
                            style={{ left: `${weekIndex * 14}px` }}
                        >
                            {month}
                        </span>
                    ))}
                </div>
            </div>

            {/* Graph */}
            <div className="flex gap-8">
                {/* Day labels */}
                <div className="flex flex-col justify-between text-xs text-neutral-400 py-0.5" style={{ height: '98px' }}>
                    <span>Sun</span>
                    <span>Tue</span>
                    <span>Thu</span>
                    <span>Sat</span>
                </div>

                {/* Weeks grid */}
                <div className="flex gap-[3px] overflow-x-auto pb-2 mt-4">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[3px]">
                            {week.map((day, dayIndex) => {
                                const isCurrentYear = day.date.getFullYear() === currentYear
                                const title = day.count > 0 
                                    ? `${day.count} release${day.count > 1 ? 's' : ''} on ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                    : day.count === 0 
                                    ? `No releases on ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                    : ''
                                
                                return (
                                    <div
                                        key={dayIndex}
                                        className={`w-[11px] h-[11px] rounded-sm ${getColor(day.count)} ${day.count >= 0 ? 'hover:ring-1 hover:ring-neutral-400 cursor-pointer' : ''}`}
                                        title={title}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3 text-xs text-neutral-500">
                <span>Less</span>
                <div className="flex gap-[3px]">
                    <div className="w-[11px] h-[11px] rounded-sm bg-neutral-100"></div>
                    <div className="w-[11px] h-[11px] rounded-sm bg-green-400"></div>
                    <div className="w-[11px] h-[11px] rounded-sm bg-green-600"></div>
                    <div className="w-[11px] h-[11px] rounded-sm bg-green-900"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    )
}

export default ProductionStreakGraph

