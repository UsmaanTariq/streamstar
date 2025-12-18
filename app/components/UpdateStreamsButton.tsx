'use client'

import { useState } from 'react'

const UpdateStreamsButton = () => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleUpdate = async () => {
        if (!confirm('Update streams for all tracks? This may take a few minutes.')) {
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/update-streams', {
                method: 'POST'
            })
            const data = await response.json()
            setResult(data.results)
            alert(`Updated! Success: ${data.results.success}, Failed: ${data.results.failed}, Skipped: ${data.results.skipped}`)
        } catch (error) {
            alert('Failed to update streams')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative z-20">
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Updating...' : '🔄 Update All Streams'}
            </button>
            
            {result && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <p className="text-gray-800">✅ Success: {result.success}</p>
                    <p className="text-gray-800">❌ Failed: {result.failed}</p>
                    <p className="text-gray-800">⏭️ Skipped: {result.skipped}</p>
                    <p className="text-gray-800">📊 Total: {result.total}</p>
                </div>
            )}
        </div>
    )
}

export default UpdateStreamsButton