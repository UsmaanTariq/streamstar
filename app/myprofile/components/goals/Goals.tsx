'use client'

import AddGoal from "./AddGoal";


const Goals = () => {

    return (
        <>
            <div className="flex justify-center bg-[#DFE0E2]">
                <div className="flex flex-col p-8 max-w-12xl w-full  bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden border-gray-300 border-1">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">Your Goals</h1>
                        <AddGoal />
                    </div>
                </div>
            </div>
        </>
    )

}

export default Goals;