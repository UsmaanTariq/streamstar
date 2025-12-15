import { useState } from "react"
import { createTrack } from "@/lib/database/tracks"
import { searchYoutubeVideo } from "@/services/YoutubeApi"
import Image from "next/image"

interface AddButtonProps {
    trackID: string
    artist: string
    albumName: string
    releaseDate: string
    trackName: string
    score: number
    spotify_url: string
    image_url: string
}

const AddButton = ({trackID, artist, albumName, releaseDate, trackName, score, spotify_url, image_url}: AddButtonProps) => {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [roles, setRoles] = useState<string[]>([])
    const [customRole, setCustomRole] = useState("")
    const [notes, setNotes] = useState("")

    const availableRoles = [
        "Producer",
        "Co-Producer",
        "Executive Producer",
        "Mixing Engineer",
        "Mastering Engineer",
        "Recording Engineer",
        "Songwriter",
        "Composer",
        "Arranger",
        "Session Musician"
    ]

    const handleRoleToggle = (role: string) => {
        setRoles(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role)
                : [...prev, role]
        )
    }

    const handleAddTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Combine selected roles with custom role
        const allRoles = [...roles]
        if (customRole.trim()) {
            allRoles.push(customRole.trim())
        }

        if (allRoles.length === 0) {
            alert("Please select or enter at least one role")
            return
        }

        try {
            setLoading(true)
            
            const result = await createTrack({
                trackID,
                artist,
                albumName,
                releaseDate,
                trackName,
                score,
                spotify_url,
                image_url,
                role: allRoles,
                notes: notes.trim()
            })

            if (result.success) {
                alert(result.message)
                setShowModal(false)
                setRoles([])
                setCustomRole("")
                setNotes("")
            } else {
                alert(result.error)
            }
            
        } catch (error) {
            console.error('Error adding track:', error)
            alert('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (!loading) {
            setShowModal(false)
            setRoles([])
            setCustomRole("")
            setNotes("")
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Add Track
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none"
                        >
                            &times;
                        </button>

                        {/* Track Info */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">Add Track Details</h2>
                            <div className="flex gap-3 mb-4">
                                {image_url && (
                                    <Image
                                        src={image_url}
                                        alt={trackName}
                                        width={64}
                                        height={64}
                                        className="h-16 w-16 rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{trackName}</h3>
                                    <p className="text-gray-600">{artist}</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddTrack} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Your Role(s) <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {availableRoles.map((role) => (
                                        <label key={role} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                                            <input
                                                type="checkbox"
                                                checked={roles.includes(role)}
                                                onChange={() => handleRoleToggle(role)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional details about your contribution..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Adding...' : 'Add Track'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddButton