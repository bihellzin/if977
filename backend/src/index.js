require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const createSocket = require("./socket");

const clientURL = process.env.CLIENT_URL || "*";

const app = express();
app.use(cors({ origin: clientURL }));
app.use(helmet());

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);

const socket = createSocket(server, {
  cors: { origin: clientURL },
});
