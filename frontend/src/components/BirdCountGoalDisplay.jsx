import React from 'react'

export default function BirdCountGoalDisplay({ goal }) {
    if (!goal) return null;

    switch (goal.status) {
        case 'inProgress':
            return (
                <div>
                    <p>Find {goal.birdsFound} / {goal.level * 3} birds</p>
                </div>
            );
        case 'success':
            return (
                <div>
                    <p>Find {goal.birdsFound} / {goal.level * 3} birds - Success!</p>
                </div>
            );
        case 'failed':
            return (
                <div>
                    <p>Find {goal.birdsFound} / {goal.level * 3} birds - Failed</p>
                </div>
            );
        default:
            return null;
    }
}