import { useEffect, useState } from 'react';
import NavigationButton from '../components/NavigationButton';
import { getActiveTrip } from '../api/api';

export default function Start() {
    const [hasActiveTrip, setHasActiveTrip] = useState(false);

    useEffect(() => {
        getActiveTrip(localStorage.getItem('token'))
            .then(res => {
                if (res.data && res.data.isActive) {
                    setHasActiveTrip(true);
                }
            })
            .catch(error => {
                console.error("Error fetching active trip:", error);
            });
    }, []);

    return (
        <div>
            <NavigationButton path="/" text="back" />
            <br />
            <NavigationButton path="/start/trip" text={hasActiveTrip ? "Resume Trip" : "Start a trip!"} />
            <br />
            <NavigationButton path={`/start/history`} text="Trip History" />
        </div>
    )
}
