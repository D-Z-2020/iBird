const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

//import routes
const routes = require("./routes");


// Setup Express
const app = express();
const PORT = process.env.PORT || 3001;

// set CORS to deal with the backend, frontend running on different hosts
app.use(cors());

// Setup body-parser
app.use(express.json());

// Setup our routes.
app.use("/routes", routes);

// testing
app.get('/', (req, res) => {
  res.send('Hello World');
});


// connect DB, if success, start the server.
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() =>
    app.listen(PORT, () => console.log(`iBird Server listening on port ${PORT}!`))
  );
