'use client'

import { useState } from 'react'
import { getYouTubeViews, searchYoutubeVideo } from '@/services/YoutubeApi'

export default function TestYouTube() {
    const [videoId, setVideoId] = useState('PjWk0G4hZH4')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    const testAPI = async () => {
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const views = await getYouTubeViews(videoId)
            setResult({ viewCount: views })
            console.log('✅ Success! Views:', views)
        } catch (err: any) {
            setError(err.message || 'Failed to fetch views')
            console.error('❌ Error:', err)
        } finally {
            setLoading(false)
        }
    }

    searchYoutubeVideo("Hello", "Adele")

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-12">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-zinc-200">
                    <h1 className="text-3xl font-bold mb-2">YouTube API Test</h1>
                    <p className="text-zinc-600 mb-8">Test fetching YouTube video views</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                YouTube Video ID
                            </label>
                            <input
                                type="text"
                                value={videoId}
                                onChange={(e) => setVideoId(e.target.value)}
                                placeholder="Enter video ID (e.g., PjWk0G4hZH4)"
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                Example: https://www.youtube.com/watch?v=<strong>PjWk0G4hZH4</strong>
                            </p>
                        </div>

                        <button
                            onClick={testAPI}
                            disabled={loading || !videoId}
                            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Fetching...' : 'Get Views'}
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-semibold text-green-900 mb-2">✅ Success!</h3>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-green-700">
                                    {result.viewCount.toLocaleString()} views
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                            <p className="text-xs text-red-600 mt-2">
                                Check console for more details
                            </p>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">📝 Setup Checklist:</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>✓ Add YOUTUBE_API_KEY to .env.local</li>
                            <li>✓ Restart your dev server after adding the key</li>
                            <li>✓ Check console for detailed logs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

