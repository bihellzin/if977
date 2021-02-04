const express = require("express");

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => `Server listening at http://localhost:${port}`);
