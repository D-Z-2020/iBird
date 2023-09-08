const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// DB Schema for a user
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  passHash: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// DB Schema for a trip
const tripSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  locations: [{
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
  }],
  isActive: { type: Boolean, default: true },
  suspiciousLocation: { type: Boolean, default: false },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  startDate: { type: Date },
  endDate: { type: Date },
  distance: { type: Number, default: 0 },
  elevationGain: { type: Number, default: 0 }
});

const imageSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  s3Key: { type: String, required: true },
  birdId: { type: String, default: "bird" }, //change to refering to bird table in the future

  timestamp: { type: Date, required: true },
  location: {
    lat: {
      type: Number,
      required: false
    },
    lng: {
      type: Number,
      required: false
    }
  },
});

const User = mongoose.model("User", userSchema);
const Trip = mongoose.model("Trip", tripSchema);
const Image = mongoose.model('Image', imageSchema);

module.exports = { User, Trip, Image };
