import { useState } from "react"
import Image from "next/image"
import { Edit } from "lucide-react"
import availableRoles from "@/helper/availableRoles"
import { editUserTrack } from "@/lib/database/user_tracks"

interface EditTrackProps {
    user_track_id: number
    artist: string
    albumName: string
    releaseDate: string
    trackName: string
    imageUrl: string
    role: string[]

}

const EditTrack = ({user_track_id, artist, albumName, releaseDate, trackName, role, imageUrl}: EditTrackProps) => {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [roles, setRoles] = useState<string[]>([])
    const [customRole, setCustomRole] = useState("")
    const [notes, setNotes] = useState("")

    const handleRoleToggle = (role: string) => {
        setRoles(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role)
                : [...prev, role]
        )
    }

    const handleEditTrack = async (e: React.FormEvent) => {
        e.preventDefault()

        const allRoles = [...roles]

        if (allRoles.length === 0) {
            alert("Please select or enter at least one role")
            return
        }

        try {
            setLoading(true)
            
            const result = await editUserTrack(
                user_track_id,
                allRoles,
                notes
            )

            if (result.success) {
                alert(result.message)
                setShowModal(false)
                setRoles([])
                setCustomRole("")
                setNotes("")
            } else {
                console.log("Error")
            }
            
        } catch (error) {
            console.error('Error adding track:', error)
            alert('An unexpected error occurred')
        } finally {
            setLoading(false)
        }

        setLoading(true)

    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
                <Edit/>
            </button>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-xl font-bold">Edit Track</h1>
                            <button onClick={() => setShowModal(false) }>X</button>
                        </div>
                        <div className="flex mb-4">
                            <Image src={imageUrl} alt={trackName} height={60} width={60} />
                            <div className="flex flex-col justify-center ml-4">
                                <h3>{trackName}</h3>
                                <h4>{artist}</h4>
                            </div>
                        </div>
                        <form className="flex flex-col gap-2"
                            onSubmit={handleEditTrack}
                        >
                            <p>Your Roles(s)</p>
                            <div className="border-1 border-gray-300 rounded-md p-2">
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
                            <h3>Edit Notes</h3>
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
                            <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Editing...' : 'Edit Track'}
                            </button>

                        </form>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default EditTrack