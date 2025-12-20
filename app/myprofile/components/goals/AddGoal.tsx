import { useState } from "react"
import { createGoal } from "@/lib/database/goals"

const AddGoal = () => {
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(false)
    
    // Form fields
    const [goalType, setGoalType] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [periodType, setPeriodType] = useState('')
    const [periodStart, setPeriodStart] = useState('')
    const [periodEnd, setPeriodEnd] = useState('')
    const [progressSource, setProgressSource] = useState('')
    const [target, setTarget] = useState(0)
    
    const handleModal = () => {
        setModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createGoal({
                goalType,
                title,
                description,
                periodType,
                periodStart,
                periodEnd,
                progressSource,
                target
            })

            alert('Goal created successfully!')
            // Reset form
            setGoalType('')
            setTitle('')
            setDescription('')
            setPeriodType('')
            setPeriodStart('')
            setPeriodEnd('')
            setProgressSource('')
            setTarget(0)
            setModal(false)
        } catch (error: any) {
            console.error('Error:', error)
            alert(error.message || 'Failed to create goal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button 
                className="bg-blue-500 text-white font-bold rounded py-2 px-3 mr-12 hover:bg-blue-600 transition-colors" 
                onClick={handleModal}
            >
                Add Goal
            </button>
            
            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Create New Goal</h1>
                            <button 
                                onClick={() => setModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8"
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Goal Type */}
                            <div>
                                <label htmlFor="goalType" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Goal Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="goalType"
                                    value={goalType}
                                    onChange={(e) => setGoalType(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select goal type...</option>
                                    <option value="total_streams">Total Streams</option>
                                    <option value="track_streams">Track Streams</option>
                                    <option value="role_streams">Role Streams</option>
                                    <option value="artist_streams">Artist Streams</option>
                                    <option value="track_count">Track Count</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Goal Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="e.g., Reach 1 Million Total Streams"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {/* Target */}
                            <div>
                                <label htmlFor="target" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Target <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="target"
                                    value={target}
                                    onChange={(e) => setTarget(parseInt(e.target.value))}
                                    required
                                    placeholder="e.g., 10"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Add details about your goal..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* Period Type */}
                            <div>
                                <label htmlFor="periodType" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Period Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="periodType"
                                    value={periodType}
                                    onChange={(e) => setPeriodType(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select period...</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="yearly">Yearly</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="periodStart" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="periodStart"
                                        value={periodStart}
                                        onChange={(e) => setPeriodStart(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="periodEnd" className="block text-sm font-semibold text-gray-700 mb-2">
                                        End Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="periodEnd"
                                        value={periodEnd}
                                        onChange={(e) => setPeriodEnd(e.target.value)}
                                        required
                                        min={periodStart}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Progress Source */}
                            <div>
                                <label htmlFor="progressSource" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Progress Source <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="progressSource"
                                    value={progressSource}
                                    onChange={(e) => setProgressSource(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select source...</option>
                                    <option value="spotify">Spotify Only</option>
                                    <option value="youtube">YouTube Only</option>
                                    <option value="all_platforms">All Platforms</option>
                                </select>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : 'Create Goal'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddGoal;