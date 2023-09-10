import React from 'react'
import BirdSpecificGoalDisplay from './BirdSpecificGoalDisplay'

export default function BirdSpecificGoalProgress({ goals }) {
    return (
        <div>
            {goals && goals.map(goal => (
                <BirdSpecificGoalDisplay key={goal._id} goal={goal} />
            ))}
        </div>
    )
}
