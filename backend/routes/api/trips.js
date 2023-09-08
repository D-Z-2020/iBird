const express = require('express');
const { User, Trip } = require("../../db/schema");
const { verifyToken } = require("../../middleware/auth.js");
const router = express.Router();
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require('axios');

const client = new Client({});

router.post("/startNewTrip", verifyToken, async (req, res) => {
    const userId = req.user._id;

    const trip = await Trip.findOne({ userId, isActive: true });
    if (trip) return res.status(400).send("You can only have one active trip").populate('images');

    const newTrip = await Trip.create({ userId });

    return res.status(201).json(newTrip);
});

router.post("/addLocation", verifyToken, async (req, res) => {
    const userId = req.user._id;
    const { latitude, longitude, timestamp } = req.body;

    const trip = await Trip.findOne({ userId, isActive: true });

    if (!trip) return res.status(400).send("No active trip found.");

    if (trip.locations.length > 0) {
        const lastLocation = trip.locations[trip.locations.length - 1];

        // If the new location matches the last location, skip it.
        if (latitude === lastLocation.latitude && longitude === lastLocation.longitude) {
            return res.status(200).json(trip);
        }

        try {
            // API call to compute distance
            const response = await client.distancematrix({
                params: {
                    origins: [{ lat: lastLocation.latitude, lng: lastLocation.longitude }],
                    destinations: [{ lat: latitude, lng: longitude }],
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });

            // This value is in meters
            const distance = response.data.rows[0].elements[0].distance.value;
            trip.distance += distance;

            // calculate elevation gain
            const path = trip.locations.map(loc => ({ lat: loc.latitude, lng: loc.longitude }));

            const totalElevationGain = await getElevationAlongPath(path);

            if (totalElevationGain !== null) {
                trip.elevationGain = totalElevationGain;
            }

            const timeDifference = new Date(timestamp) - new Date(lastLocation.timestamp);

            if (timeDifference > 1800000) { // 30 minutes in milliseconds
                trip.isActive = false;
                await trip.save();
                return res.status(400).send("Trip ended due to long time inactivated.");
            } else if (distance > 500) { // More than 500 meters
                if (trip.suspiciousLocation) {
                    // Delete last location and add new location, reset flag
                    trip.locations.pop();
                    trip.suspiciousLocation = false;
                } else {
                    // Add location and set flag
                    trip.suspiciousLocation = true;
                }
                trip.locations.push({ latitude, longitude, timestamp });
                trip.endDate = new Date(timestamp);
            } else {
                trip.locations.push({ latitude, longitude, timestamp });
                trip.suspiciousLocation = false; // Resetting the flag if the previous was suspicious
                trip.endDate = new Date(timestamp);
            }

            await trip.save();
            return res.status(200).json(trip);

        } catch (error) {
            console.error(error);
            return res.status(500).send("Error computing distance using Google Maps.");
        }
    } else {
        trip.locations.push({ latitude, longitude, timestamp });
        trip.startDate = new Date(timestamp);
        trip.endDate = new Date(timestamp);
        await trip.save();
        return res.status(200).json(trip);
    }
});

router.get("/getActiveTrip", verifyToken, async (req, res) => {
    const userId = req.user._id;
    const trip = await Trip.findOne({ userId, isActive: true }).populate('images');

    if (!trip) return res.send("No active trip");

    return res.status(200).json(trip);
});

router.get("/getInactiveTrips", verifyToken, async (req, res) => {
    const userId = req.user._id;
    const trip = await Trip.find({ userId, isActive: false });

    if (!trip) return res.send("No inactive trip");

    return res.status(200).json(trip);
});

router.get("/getTrip/:tripId", verifyToken, async (req, res) => {
    const userIdFromToken = req.user._id;
    const tripId = req.params.tripId;

    const trip = await Trip.findById(tripId).populate('images');

    // If no trip is found with the given ID
    if (!trip) return res.status(404).send("Trip not found");

    // Check if the user ID from the token matches the user ID associated with the trip
    if (trip.userId.toString() !== userIdFromToken.toString()) {
        return res.status(403).send("Unauthorized: You can't access this trip.");
    }

    return res.status(200).json(trip);
});

router.post("/endTrip", verifyToken, async (req, res) => {
    const userId = req.user._id;

    const trip = await Trip.findOne({ userId, isActive: true });
    if (!trip) return res.status(400).send("No active trip found.");

    trip.isActive = false;
    trip.endDate = Date.now();
    await trip.save();

    return res.status(200).json(trip);
});

async function getElevationAlongPath(path) {
    // If path length is less than 2, return elevation gain as 0
    if (path.length < 2) {
        return 0;
    }

    const basePath = 'https://maps.googleapis.com/maps/api/elevation/json';
    const pathString = path.map(point => `${point.lat},${point.lng}`).join('|');
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    try {
        const response = await axios.get(`${basePath}?path=${pathString}&samples=${path.length}&key=${apiKey}`);

        if (response.data.status === 'OK') {
            let totalElevationGain = 0;
            const elevationData = response.data.results;

            // Iterate over the elevation points to compute elevation gain
            for (let i = 0; i < elevationData.length - 1; i++) {
                let elevationChange = elevationData[i + 1].elevation - elevationData[i].elevation;

                // Add positive elevation changes to totalElevationGain
                if (elevationChange > 0) {
                    totalElevationGain += elevationChange;
                }
            }

            return totalElevationGain;
        } else {
            console.error("Error computing elevation gain:", error);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = router;
