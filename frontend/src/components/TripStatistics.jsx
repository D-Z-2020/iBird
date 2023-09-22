import React from 'react'

// set realSpeed==-1 when use in trip history
export default function TripStatistics({ trip, realSpeed }) {
    return (
        <div>
            {realSpeed !== -1 && <p>Speed: {realSpeed ? `${realSpeed.toFixed(2)} m/s` : "N/A"}</p>}
            {trip &&
                <>
                    <p>Total distance: {trip.distance}</p>
                    <p>Total elevation gain: {trip.elevationGain}</p>
                </>
            }
        </div>
    )
}
