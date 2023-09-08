import { useState, useEffect } from "react";
import NavigationButton from "../components/NavigationButton";
import { startNewTrip, getActiveTrip, addLocation, endTrip } from "../api/api";
import { useNavigate } from "react-router-dom";
import TripMap from "../components/TripMap";
import BirdImageUploader from "../components/BirdImageUploader";

const aucklandlat = -36.8484;
const aucklandLng = 174.7633;

export const center = {
    lat: aucklandlat,
    lng: aucklandLng
};


export default function Trip() {
    const [path, setPath] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(center);
    const [speed, setSpeed] = useState(null);
    const [trip, setTrip] = useState(null);
    const [currentTimestamp, setCurrentTimestamp] = useState(null);
    const [autoCentering, setAutoCentering] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchTripDetails = () => {
        return getActiveTrip(token)
            .then(res => {
                if (res.data && res.data.locations) {
                    setTrip(res.data);
                    const existingPath = res.data.locations.map(loc => ({
                        lat: loc.latitude,
                        lng: loc.longitude
                    }));
                    setPath(existingPath);
                } else {
                    return startNewTrip(token)
                        .then((res) => {
                            setTrip(res.data);
                        });
                }
            });
    };

    useEffect(() => {
        let watchId;

        const trackLocation = () => {
            if (navigator.geolocation) {
                watchId = navigator.geolocation.watchPosition(showPosition, (error) => {
                    console.log("Error: " + error.message);
                }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
            } else {
                alert("Geolocation is not supported.");
            }
        };

        const showPosition = (position) => {
            const latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(position.coords.latitude, position.coords.longitude)

            // Add the location to the backend every time we get a new location
            const currentTime = new Date().toISOString();
            addLocation(token, latLng.lat, latLng.lng, currentTime)
                .then(res => {
                    const updatedPath = res.data.locations.map(loc => ({
                        lat: loc.latitude,
                        lng: loc.longitude
                    }));

                    setPath(updatedPath);
                    setCurrentPosition(latLng);
                    setSpeed(position.coords.speed);
                    setCurrentTimestamp(currentTime);
                })
                .catch(error => {
                    console.log(error.response.data);
                    navigate("/start", { replace: true });
                });
        };

        // Try to get the active trip
        getActiveTrip(token)
            .then(res => {
                if (res.data && res.data.locations) {
                    setTrip(res.data);
                    const existingPath = res.data.locations.map(loc => ({
                        lat: loc.latitude,
                        lng: loc.longitude
                    }));
                    setPath(existingPath);
                    trackLocation();
                } else {
                    startNewTrip(token)
                        .then((res) => {
                            setTrip(res.data);
                            trackLocation();
                        })
                }
            })


        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    const handleEndTrip = () => {
        endTrip(token)
            .then(() => {
                navigate("/start", { replace: true });
            })
            .catch(error => {
                console.error("Error ending the trip:", error);
            });
    }

    return (
        <div>
            <NavigationButton path="/start" text="back" />
            <button onClick={handleEndTrip}>End Trip</button>
            <BirdImageUploader
                onUploadComplete={fetchTripDetails}
                location={currentPosition}
                timestamp={currentTimestamp}
            />

            <button onClick={() => setAutoCentering(prev => !prev)}>
                {autoCentering ? "Stop Centering" : "Resume Centering"}
            </button>

            <div id="speedDisplay">Speed: {speed ? `${speed.toFixed(2)} m/s` : "N/A"}</div>

            <TripMap
                path={path}
                center={currentPosition}
                autoCentering={autoCentering}
                images={trip?.images}
                trip={trip}
            />
        </div>
    );
}
