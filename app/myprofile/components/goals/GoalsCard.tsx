

const GoalsCard = ({title, description, periodStart, periodEnd}: {title: string, description: string, periodStart: string, periodEnd: string}) => {
    return (
        <div className="flex flex-col p-8 gap-2 bg-white shadow-lg rounded-lg">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="font-italic font-gray-700">{description}</p>
            <div className="flex justify-between">
                <p>{periodStart}</p>
                <p>{periodEnd}</p>
            </div>
        </div>
    )

}

export default GoalsCard