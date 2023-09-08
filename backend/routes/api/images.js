const express = require('express');
const { Trip, Image } = require("../../db/schema");
const { verifyToken } = require("../../middleware/auth.js");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
    region: process.env.AMAZON_REGION
});
const s3 = new AWS.S3();


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AMAZON_BUCKET_NAME,
        acl: 'private', // Set ACL to private
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Generate a unique file key using time for now and UUID
            const uniqueFileKey = Date.now().toString() + '-' + uuidv4() + '-' + file.originalname;
            cb(null, uniqueFileKey);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.', false));
        }
    }
});

router.post('/upload', verifyToken, upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        // Check if the user has an active trip
        const activeTrip = await Trip.findOne({ userId: req.user._id, isActive: true });

        if (!activeTrip) {
            return res.status(400).send('No active trip found. Please start a trip before uploading photos.');
        }

        // Get the location and timestamp from the request
        const location = req.body.location ? JSON.parse(req.body.location) : null;
        const timestamp = req.body.timestamp || new Date();

        const newImage = new Image({
            s3Key: req.file.key,
            userId: req.user._id,
            location: location,
            timestamp: timestamp
        });

        await newImage.save();

        // Update the trip's images array by pushing the new image's ObjectId
        activeTrip.images.push(newImage._id);
        await activeTrip.save();

        res.status(201).send('Image uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading image');
    }
});

// Endpoint to get an image by key
router.get('/getImage/:key', verifyToken, async (req, res) => {
    try {
        const image = await Image.findOne({ s3Key: req.params.key, userId: req.user._id });

        if (!image) {
            return res.status(404).send('Image not found or you do not have permission to view it.');
        }

        // Generate a pre-signed URL for the image
        const url = s3.getSignedUrl('getObject', {
            Bucket: process.env.AMAZON_BUCKET_NAME,
            Key: image.s3Key,
            Expires: 60 * 30 //30 minutes access to the image
        });

        res.status(200).send(url);
    } catch (error) {
        res.status(500).send('Error retrieving image');
    }
});

module.exports = router;
