import { useNavigator } from "../hooks/useNavigator";
export default function BirdSpecificGoalDisplay({ goal }) {
    const navigateWithState = useNavigator();
    if (!goal) return null;
    switch (goal.status) {
        case 'inProgress':
            return (
                <div onClick={() => navigateWithState(`/bird/${goal.birdName}`, { replace: true })}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    <img src={goal.image} alt={goal.birdName} height={100} />
                    <p>Target Bird: {goal.birdName}</p>
                </div>
            );
        case 'success':
            return (
                <div onClick={() => navigateWithState(`/bird/${goal.birdName}`, { replace: true })}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    <p>find {goal.birdName} - Success!</p>
                </div>
            );
        case 'failed':
            return (
                <div onClick={() => navigateWithState(`/bird/${goal.birdName}`, { replace: true })}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    <p>find {goal.birdName} - Failed</p>
                </div>
            );
        default:
            return null;
    }
}