import { useState, useEffect } from "react";
import FitnessGoalInfDisplay from "./FitnessGoalInfDisplay";

export default function FitnessGoalProgress({ trip }) {
    const [remainingTimeDistance, setRemainingTimeDistance] = useState(null);
    const [remainingTimeElevation, setRemainingTimeElevation] = useState(null);

    useEffect(() => {
        if (trip && trip.distanceGoal && trip.elevationGoal) {
            const startTime = new Date(trip.distanceGoal.startDate).getTime();
            const durationMillis = trip.distanceGoal.duration * 60 * 1000;
            const endTime = startTime + durationMillis;
            const currentMillis = new Date().getTime();
            const remainingMillis = endTime - currentMillis;
            const remainingSeconds = Math.floor(remainingMillis / 1000);
            setRemainingTimeDistance(remainingSeconds)

            const startTimeEle = new Date(trip.elevationGoal.startDate).getTime();
            const durationMillisEle = trip.elevationGoal.duration * 60 * 1000;
            const endTimeEle = startTimeEle + durationMillisEle;
            const currentMillisEle = new Date().getTime();
            const remainingMillisEle = endTimeEle - currentMillisEle;
            const remainingSecondsEle = Math.floor(remainingMillisEle / 1000);
            setRemainingTimeElevation(remainingSecondsEle)
        }
    }, [trip]);

    // Timer logic, decrease the remaining time every second
    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTimeDistance > 0) {
                setRemainingTimeDistance(remainingTimeDistance - 1);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTimeDistance]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTimeElevation > 0) {
                setRemainingTimeElevation(remainingTimeElevation - 1);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTimeElevation]);

    return (
        <div>
            <h3>Fitness Goals:</h3>
            {trip &&
                <>
                    <FitnessGoalInfDisplay
                        goal={trip.distanceGoal}
                        currentValue={trip.distance}
                        target={trip.distanceGoal.distance}
                        title="Distance Goal"
                        endGrade={trip.distanceGoal.endDistance}
                    />
                    {trip.distanceGoal.status === "inProgress" && <p>Remaining Time: {Math.floor(remainingTimeDistance / 60)}:{(remainingTimeDistance % 60).toString().padStart(2, '0')}</p>}
                    
                    <FitnessGoalInfDisplay
                        goal={trip.elevationGoal}
                        currentValue={trip.elevationGain}
                        target={trip.elevationGoal.elevationGain}
                        title="Elevation Gain Goal"
                        endGrade={trip.elevationGoal.endElevationGain}
                    />
                    {trip.elevationGoal.status === "inProgress" && <p>Remaining Time: {Math.floor(remainingTimeElevation / 60)}:{(remainingTimeElevation % 60).toString().padStart(2, '0')}</p>}
                </>}
        </div>
    );
}
