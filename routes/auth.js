const authRouter = require("express").Router();

const authController = require("../controllers/authController");
const route = require("../middlewares/accessRoute");

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/token", authController.newAccessToken);

module.exports = authRouter;
