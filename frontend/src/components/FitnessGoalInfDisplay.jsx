
export default function FitnessGoalInfDisplay({ goal, currentValue, target, title, endGrade }) {
    if (goal.status === "failed") {
        return <>
            <p>{title}: {target} meters in {goal.duration} minutes failed! </p>
            <p>Your grade: {endGrade} meters</p>
        </>;
    }
    if (goal.status === "inProgress") {
        return <p>{title}: {currentValue} / {target} meters ({(currentValue / target).toFixed(2) * 100}%)</p>;
    }
    if (goal.status === "success") {
        return <>
            <p>{title}: {target} meters in {goal.duration} minutes success!</p>
            <p>Time to complete: {(new Date(goal.endDate).getTime() - new Date(goal.startDate).getTime()) / 1000 / 60} minutes</p>
        </>;
    }
    return null;
}



