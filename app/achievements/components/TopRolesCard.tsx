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
        <div className="w-full bg-white rounded-2xl shadow-xl p-6 border border-neutral-200">
            <h1 className="text-2xl font-black text-neutral-900 mb-6">Top Roles</h1>
            <div className="flex flex-col gap-3">
            {topRoles.map((roles, index) => (
                <div key={index} className="bg-neutral-50 rounded-xl p-5 hover:bg-neutral-100 transition-colors border border-neutral-200">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 text-white font-black text-lg flex-shrink-0">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h1 className="font-bold text-neutral-900 text-lg">{roles.role}</h1>
                            <p className="text-sm text-neutral-600 font-medium">{roles.track_count} track{roles.track_count !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="ml-14">
                        <p className="text-2xl font-black text-neutral-900">{roles.total_streams.toLocaleString()}</p>
                        <p className="text-xs text-neutral-500 font-medium">total streams</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default TopRolesCard
