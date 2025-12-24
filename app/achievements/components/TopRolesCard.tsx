interface RoleDetails {
    role: string
    total_streams: number
    spotify_streams: number
    youtube_streams: number
    track_count: number
}

interface TopRoles {
    topRoles: Array<RoleDetails>
}

const TopRolesCard = ({topRoles}: TopRoles) => {
    if (!topRoles|| topRoles.length === 0) {
        return null
    }
    
    return (
        <div className="w-full p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg mt-4">
            <h1 className="text-xl font-bold mb-5 text-gray-800">Your Top Roles</h1>
            <div className="flex flex-col gap-3">
            {topRoles.map((roles, index) => (
                <div key={index} className="border border-blue-200 bg-white/80 backdrop-blur rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full text-black font-bold text-sm">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h1 className="font-semibold text-gray-800">{roles.role}</h1>
                            <p className="text-sm text-gray-600">Tracks: {roles.track_count}</p>
                        </div>
                    </div>
                    <h2 className="text-sm text-gray-600 mt-2 ml-11">
                        <span className="font-semibold">{roles.total_streams.toLocaleString()}</span> streams
                    </h2>
                </div>
            ))}
            </div>
        </div>
    )
}

export default TopRolesCard