import Image from "next/image"

interface UserProfile {
    user_name: string
    avatar_url: string | null
    email: string
}

interface UserInfoProps {
    userProfile: UserProfile | null
    totalStreams: number
    trackCount: number
}

const UserInfo = ({userProfile, totalStreams, trackCount}: UserInfoProps) => {
    const avatarUrl = userProfile?.avatar_url || '/default-avatar.png'
    
    return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-neutral-700 mb-6 ring-4 ring-white shadow-lg">
                    {userProfile?.avatar_url ? (
                        <Image 
                            src={userProfile.avatar_url} 
                            alt={userProfile.user_name} 
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white">
                            {userProfile?.user_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{userProfile ? userProfile.user_name : 'Producer'}</h1>
                <div className="mt-6 space-y-4 w-full">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <p className="text-white/70 text-sm mb-2">Total Streams</p>
                        <p className="text-5xl font-black text-white">{totalStreams.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <p className="text-white/70 text-sm mb-2">Tracks Produced</p>
                        <p className="text-4xl font-black text-white">{trackCount}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo