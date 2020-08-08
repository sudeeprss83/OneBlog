const http = require("http");
const express = require("express");
require("dotenv").config();

const app = express();

const server = http.createServer(app);

require("./config/db");

const indexRoute = require("./routes/index");
const authRoute = require("./routes/auth");

// middlewares
app.use(express.json());

app.use("/", indexRoute);
app.use("/auth", authRoute);

const port = process.env.PORT || 5500;

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
