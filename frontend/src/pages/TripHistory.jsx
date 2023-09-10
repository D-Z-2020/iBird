import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TripMap from '../components/TripMap';
import { getTripById } from '../api/api';
import NavigationButton from '../components/NavigationButton';
import FitnessGoalProgress from '../components/FitnessGoalProgress';
import BirdSpecificGoalProgress from "../components/BirdSpecificGoalProgress";
import BirdCountGoalProgress from "../components/BirdCountGoalProgress";

export default function TripHistory() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [tripPath, setTripPath] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (tripId) {
            getTripById(token, tripId)
                .then(response => {
                    setTrip(response.data);
                    setTripPath(response.data.locations.map(loc => ({
                        lat: loc.latitude,
                        lng: loc.longitude
                    })));
                })
                .catch(error => {
                    console.error("Error fetching trip details:", error);
                });
        }
    }, [tripId, token]);

    return (
        <div>
            <NavigationButton path="/start/history" text="back" />
            <h2>Trip History</h2>
            {trip && <FitnessGoalProgress trip={trip}/>}
            <BirdSpecificGoalProgress goals={trip?.birdSpecificGoals}/>
            <BirdCountGoalProgress goals={trip?.birdCountGoals}/>
            {trip && <TripMap path={
                tripPath} center={tripPath[0]} images={trip?.images} isHistory={true} trip={trip} />}
        </div>
    )
}
