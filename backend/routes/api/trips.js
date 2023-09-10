const express = require('express');
const { User, Trip, Bird } = require("../../db/schema");
const { verifyToken } = require("../../middleware/auth.js");
const router = express.Router();
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require('axios');

const {
    LEVEL_1_DISTANCE_GOAL,
    LEVEL_2_DISTANCE_GOAL,
    LEVEL_3_DISTANCE_GOAL,
    LEVEL_1_ELEVATION_GOAL,
    LEVEL_2_ELEVATION_GOAL,
    LEVEL_3_ELEVATION_GOAL } = require('../../goals_setting/fitnessGoal');

const client = new Client({});

router.post("/startNewTrip", verifyToken, async (req, res) => {
    const userId = req.user._id;

    const trip = await Trip.findOne({ userId, isActive: true });
    if (trip) return res.status(400).send("You can only have one active trip").populate('images');

    // Check for required fields
    if (typeof req.body.isEdugaming !== 'boolean' || !req.body.fitnessLevel) {
        return res.status(400).send("Both isEdugaming and fitnessLevel are required");
    }

    let distanceGoal, elevationGoal;
    switch (req.body.fitnessLevel) {
        case 'low':
            distanceGoal = LEVEL_1_DISTANCE_GOAL;
            elevationGoal = LEVEL_1_ELEVATION_GOAL;
            break;
        case 'mid':
            distanceGoal = LEVEL_2_DISTANCE_GOAL;
            elevationGoal = LEVEL_2_ELEVATION_GOAL;
            break;
        case 'high':
            distanceGoal = LEVEL_3_DISTANCE_GOAL;
            elevationGoal = LEVEL_3_ELEVATION_GOAL;
            break;
        default:
            return res.status(400).send("Invalid fitness level provided");
    }

    let newTrip;

    if (req.body.isEdugaming) {
        // get a random bird with rarity = level
        const randomBirdArrays = await Bird.aggregate([
            { $match: { rarity: 1 } },
            { $sample: { size: 1 } }
        ]).exec();
        const bird = randomBirdArrays[0];

        if (!bird) return res.status(500).send("Could not find a suitable bird");

        const birdSpecificGoal = {
            birdId: bird._id,
            birdName: bird.name,
            image: bird.images[0],
            level: 1 // Starting level is 1 for the specific bird goal
        };

        const birdCountGoal = {
            count: 1 * 3, // For level 1, user needs to find 3 birds
            level: 1,
            birdsFound: 0
        };

        newTrip = await Trip.create({
            userId: userId,
            isEdugaming: req.body.isEdugaming,
            fitnessLevel: req.body.fitnessLevel,
            distanceGoal: distanceGoal,
            elevationGoal: elevationGoal,
            birdSpecificGoals: [birdSpecificGoal],
            birdCountGoals: [birdCountGoal]
        });
    } else {
        newTrip = await Trip.create({
            userId: userId,
            isEdugaming: req.body.isEdugaming,
            fitnessLevel: req.body.fitnessLevel,
            distanceGoal: distanceGoal,
            elevationGoal: elevationGoal
        });
    }
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
            const originDistance = trip.distance;
            trip.distance += distance;

            const lastTwoPoints = [
                { lat: lastLocation.latitude, lng: lastLocation.longitude },
                { lat: latitude, lng: longitude }
            ];

            const additionalElevationGain = await getElevationGainBetweenTwoPoints(lastTwoPoints);
            const originElevation = trip.elevationGain;

            if (additionalElevationGain !== null) {
                trip.elevationGain += additionalElevationGain;
            }
            console.log(trip.elevationGain)

            // get goal, check if complete or not
            const distanceGoal = trip.distanceGoal.distance;
            const elevationGoal = trip.elevationGoal.elevationGain;
            const distanceGoalDurationLimit = trip.distanceGoal.duration * 60 * 1000;
            const elevationGoalDurationLimit = trip.elevationGoal.duration * 60 * 1000;
            const duration = new Date(timestamp) - new Date(trip.startDate);

            if (trip.distanceGoal.status === 'inProgress') {
                trip.distanceGoal.endDistance = trip.distance;
                trip.distanceGoal.endDate = new Date(timestamp);
                if (trip.distance >= distanceGoal && duration <= distanceGoalDurationLimit) {
                    distanceGoalSuccess = true;
                    trip.distanceGoal.status = 'success';
                }
                if (duration > distanceGoalDurationLimit) {
                    trip.distanceGoal.endDistance = originDistance;
                    trip.distanceGoal.status = 'failed';
                }

            }

            if (trip.elevationGoal.status === 'inProgress') {
                trip.elevationGoal.endElevationGain = trip.elevationGain;
                trip.elevationGoal.endDate = new Date(timestamp);
                if (trip.elevationGain >= elevationGoal && duration <= elevationGoalDurationLimit) {
                    trip.elevationGoal.status = 'success';
                }
                if (duration > elevationGoalDurationLimit) {
                    trip.elevationGoal.endElevationGain = originElevation;
                    trip.elevationGoal.status = 'failed';
                }
            }


            // check if the new time is invalid
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

    // This populates the images for a trip, and for each image, it populates the birdId
    const trip = await Trip.findOne({ userId, isActive: true })
        .populate([
            {
                path: 'images',
                model: 'Image',
                populate: {
                    path: 'birdId',
                    model: 'Bird'
                }
            }
        ]);

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

    // This populates the images for a trip, and for each image, it populates the birdId
    const trip = await Trip.findById(tripId).populate([
        {
            path: 'images',
            model: 'Image',
            populate: {
                path: 'birdId',
                model: 'Bird'
            }
        }
    ]);

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

    if (trip.distanceGoal.status === 'inProgress') {
        trip.distanceGoal.status = 'failed';
    }

    if (trip.elevationGoal.status === 'inProgress') {
        trip.elevationGoal.status = 'failed';
    }

    if (trip.isEdugaming) {
        // Update bird-specific goals that are inProgress to failed
        for (let goal of trip.birdSpecificGoals) {
            if (goal.status === 'inProgress') {
                goal.status = 'failed';
            }
        }

        // Update bird count goals that are inProgress to failed
        for (let goal of trip.birdCountGoals) {
            if (goal.status === 'inProgress') {
                goal.status = 'failed';
            }
        }
    }

    trip.isActive = false;
    trip.endDate = Date.now();
    await trip.save();

    return res.status(200).json(trip);
});

async function getElevationGainBetweenTwoPoints(path) {
    // If array does not has 2 points, return elevation gain as 0
    if (path.length !== 2) {
        return 0;
    }

    const basePath = 'https://maps.googleapis.com/maps/api/elevation/json';
    const pathString = path.map(point => `${point.lat},${point.lng}`).join('|');
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    try {
        const response = await axios.get(`${basePath}?path=${pathString}&samples=${path.length}&key=${apiKey}`);

        if (response.data.status === 'OK') {
            const elevationData = response.data.results;
            console.log(path);
            console.log("last " + elevationData[1].elevation);
            console.log("first " + elevationData[0].elevation);
            let elevationChange = elevationData[1].elevation - elevationData[0].elevation;
            return elevationChange > 0 ? elevationChange : 0;
        } else {
            console.error("Error computing elevation gain:", error);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = router;
