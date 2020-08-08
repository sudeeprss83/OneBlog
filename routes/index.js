const indexRouter = require("express").Router();

indexRouter.get("/", (req, res) => {
  res.status(200).json({ message: "this is home route" });
});

module.exports = indexRouter;
