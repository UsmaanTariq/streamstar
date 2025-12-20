'use client'

import AddGoal from "./AddGoal"
import GoalsSection from "./GoalsSection"
import RefreshGoals from "./RefreshGoals"

const Goals = () => {

    return (
        <>
            <div className="flex justify-center bg-[#DFE0E2]">
                <div className="flex flex-col p-8 max-w-12xl w-full  bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden border-gray-300 border-1">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">Your Goals</h1>
                        <div className="flex gap-3">
                            <RefreshGoals />
                            <AddGoal />
                        </div>
                    </div>
                    <GoalsSection />
                </div>
            </div>
        </>
    )

}

export default Goals