const express = require('express');
const { User } = require("../../db/schema");
const bcrypt = require("bcrypt");
const { createToken } = require("../../middleware/auth.js");
const { verifyToken } = require("../../middleware/auth.js");
const router = express.Router();

// Create new account
router.post("/create", async (req, res) => {
  // Must send username and password
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(422);

  // duplicate usernames not allowed
  let user = await User.findOne({ username });
  if (user) return res.sendStatus(409);

  // create user
  user = await User.create({
    username,
    passHash: await bcrypt.hash(password, 10),
  });

  // Create and sign a JWT token
  const token = createToken(user._id.toString(), username);

  return res.status(201).json({ token });
});

// Login to existing account
router.post("/login", async (req, res) => {
  // Must send username and password
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(422);

  // User must exist
  let user = await User.findOne({ username });
  if (!user) return res.sendStatus(401);

  // Password must be correct
  const isPasswordOk = await bcrypt.compare(password, user.passHash);
  if (!isPasswordOk) return res.sendStatus(401);

  // Create and sign a JWT token
  const token = createToken(user._id.toString(), username);

  return res.status(200).json({ token });
});

// get username by token
router.get("/getUsernameFromToken", verifyToken, async (req, res) => {
  return res.json(req.user.username);
})

// get a list of all users in the database for authenticated user
router.get("/", verifyToken, async (req, res) => {
  try {
    // use projection to only return username, not password
    const users = await User.find({}, 'username');
    return res.json(users);
  } catch (err) {
    console.error(err);
    // server error
    return res.sendStatus(500);
  }
});


// search username by substring, order by best match
router.get("/search/:substring", verifyToken, async (req, res) => {
  const substring = req.params.substring;

  const pipeline = [
    {
      $match: {
        username: new RegExp(substring)
      }
    },
    {
      $addFields: {
        matchScore: {
          $indexOfCP: ["$username", substring]
        }
      }
    },
    {
      $sort: {
        matchScore: 1
      }
    },
    {
      $limit: 10
    }
  ];

  const users = await User.aggregate(pipeline);

  res.json(users);
});

// get user information by username
router.get("/:username", verifyToken, async (req, res) => {
  const user = await User.findOne({ username: req.params.username }, { 'username': 1, '_id': 1 });

  if (!user) {
    return res.sendStatus(404);
  }

  return res.json(user);
})

module.exports = router;
