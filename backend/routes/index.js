const express = require('express');

const router = express.Router();
const api = require("./api");

// Mount the API routes onto the router under the '/api' path.
router.use("/api", api);

module.exports = router;
