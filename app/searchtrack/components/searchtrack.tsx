'use client'
import { createClient } from '@/utils/supabase/client'

import { useState } from 'react'
import { searchTrack } from '@/services/spotifyApi'
import { convertSegmentPathToStaticExportFilename } from 'next/dist/shared/lib/segment-cache/segment-value-encoding'
import AddButton from './addtrack'

const SearchTrack = () => {
    const extractTracks = async () => {
        const supabase = createClient()
        const { data: tracks} = await supabase.from("tracks").select();

        return { data: tracks}
    }

    const [trackName, setTrackName] = useState('')
    const [tracks, setTracks] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        if (!trackName.trim()) return
        
        setLoading(true)
        try {
            const results = await searchTrack(trackName)
            setTracks(results)
            console.log('Track results:', results)
        } catch (error) {
            console.error('Error searching track:', error)
            alert('Failed to search track. Check console for details.')
        } finally {
            setLoading(false)
        }
    }

    const handleTrackAdd = async () => {

    }

    return (
        <>
            <div className={`min-h-screen px-12 py-6 ${tracks.length > 0 ? 'flex gap-12' : 'flex justify-center items-center'}`}>
                {/* Search Section */}
                <div className={`flex items-center ${tracks.length > 0 ? 'w-1/3' : 'w-full max-w-4xl'}`}>
                    <div className="flex flex-col gap-8 p-12 shadow-xl rounded-2xl bg-white w-full">
                        <div>
                            <h1 className="text-4xl font-bold mb-3">Search Track</h1>
                            <p className="text-lg text-gray-600">Search for a song to add to your credits</p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <input 
                                placeholder="Enter track name..." 
                                className="p-4 text-lg border-b-2 border-gray-400 focus:border-black outline-none transition-colors"
                                value={trackName}
                                onChange={(e) => setTrackName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button 
                            type="button" 
                            className="w-full text-white text-lg bg-[#0f1419] hover:bg-[#0f1419]/90 focus:ring-4 rounded-lg focus:outline-none focus:ring-[#0f1419]/50 box-border border border-transparent font-semibold leading-5 px-6 py-4 text-center dark:hover:bg-[#24292F] dark:focus:ring-[#24292F]/55 disabled:opacity-50"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search Track'}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {tracks.length > 0 && (
                    <div className="w-2/3 flex flex-col pt-20">
                        <h2 className="text-2xl font-bold mb-6">Search Results:</h2>
                        <div className="grid gap-4">
                                {tracks.map((track) => (
                                    <div 
                                        key={track.id} 
                                        className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                                    >
                                        {track.album?.images && track.album.images[0] && (
                                            <img 
                                                src={track.album.images[0].url} 
                                                alt={track.name}
                                                className="w-16 h-16 rounded object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{track.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Artist: {track.artists?.map((artist: any) => artist.name).join(', ')}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Album: {track.album?.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Release: {track.album?.release_date}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <a 
                                                href={track.external_urls.spotify} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center text-sm whitespace-nowrap"
                                            >
                                                View on Spotify
                                            </a>
                                            <AddButton 
                                                trackID={track.id}
                                                artist={track.artists?.map((artist: any) => artist.name).join(', ')}
                                                albumName={track.album.name}
                                                releaseDate={track.album.release_date}
                                                trackName={track.name}
                                                score={track.popularity}
                                                spotify_url={track.external_urls.spotify}
                                                image_url = {track.album?.images[0].url}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
            )
}

export default SearchTrack

