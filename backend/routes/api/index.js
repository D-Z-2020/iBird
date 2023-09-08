const express = require('express');

const router = express.Router();

const userRoutes = require("./users.js");
const friendRoutes = require("./friends.js");
const tripRoutes = require("./trips.js")
const imageRoutes = require("./images.js")

router.use("/users", userRoutes);
router.use("/friends", friendRoutes);
router.use("/trips", tripRoutes);
router.use("/images", imageRoutes);

module.exports = router;
