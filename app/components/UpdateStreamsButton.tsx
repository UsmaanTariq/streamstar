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
        <div>
            <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Updating...' : '🔄 Update All Streams'}
            </button>
            
            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p>✅ Success: {result.success}</p>
                    <p>❌ Failed: {result.failed}</p>
                    <p>⏭️ Skipped: {result.skipped}</p>
                    <p>📊 Total: {result.total}</p>
                </div>
            )}
        </div>
    )
}

export default UpdateStreamsButton