const http = require("http");
const express = require("express");
var cors = require("cors");

require("dotenv").config();

const app = express();

const server = http.createServer(app);

require("./config/db");

const indexRoute = require("./routes/index");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");

// middlewares
app.use(cors());
app.use(express.json());

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

const port = process.env.PORT || 5500;

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
