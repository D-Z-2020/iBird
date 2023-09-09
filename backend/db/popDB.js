const mongoose = require('mongoose');
const { Bird } = require('./schema')
const dotenv = require('dotenv');
dotenv.config();

// MongoDB connection
mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(() =>
        console.log('Connected to MongoDB')
    );

// Bird data
const birds = [
    {
        name: "Southern black-backed gull",
        maoriName: "Karoro",
        scientificName: "Larus dominicanus",
        otherNames: ["kelp gull", "seagull", "mollyhawk"],
        conservationStatus: "Not Threatened",
        rarity: 1,
        images:
            ["https://ibird-images.s3.ap-southeast-2.amazonaws.com/bird-collection-image/Southern+black-backed+gull/120026Black-backed-gull-kaikoura-Feb-2009-1.jpg",
                "https://ibird-images.s3.ap-southeast-2.amazonaws.com/bird-collection-image/Southern+black-backed+gull/120026IMG_4136.jpg"
            ]
    },
    {
        name: "Grey warbler",
        maoriName: "Riroriro",
        scientificName: "Gerygone igata",
        otherNames: ["rainbird", "teetotum", "grey gerygone"],
        conservationStatus: "Not Threatened",
        rarity: 2,
        images:
            ["https://ibird-images.s3.ap-southeast-2.amazonaws.com/bird-collection-image/Grey+warbler/1200536GreyWarbler1.jpg",
                "https://ibird-images.s3.ap-southeast-2.amazonaws.com/bird-collection-image/Grey+warbler/1200536IMG_8369.jpg"
            ]
    },
    {
        name: "Welcome swallow",
        maoriName: "Warou",
        scientificName: "Hirundo neoxena",
        otherNames: ["house swallow"],
        conservationStatus: "Not Threatened",
        rarity: 3,
        images:
            ["https://ibird-images.s3.ap-southeast-2.amazonaws.com/bird-collection-image/Welcome+swallow/1200587IMG_3352.jpg",
                "https://ibird-images.s3.ap-southeast-2.amazonaws.com/bird-collection-image/Welcome+swallow/1200587IMG_7470.jpg"
            ]
    },
];

// Insert bird data into MongoDB
Bird.insertMany(birds)
    .then(() => {
        console.log('Bird data populated successfully');
        mongoose.connection.close();  // Close the connection after insertion
    })
    .catch(error => {
        console.error('Error populating bird data:', error);
    });
