const mongoose = require("mongoose");

const connection = mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("database connection established");
  }
);

module.exports = connection;
