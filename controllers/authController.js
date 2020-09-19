const jwt = require("jsonwebtoken");
const md5 = require("md5");

const User = require("../models/user");
const Token = require("../models/token");

//user signup route
async function signup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.json({ status: 401, message: "all fields required" });
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = await new User({
        username,
        email,
        password: md5(req.body.password),
      }).save();
      res.status(200).json({ message: "user saved", newUser });
    } else {
      res.json({ status: 401, message: "user already exits" });
    }
  }
}

//user login route
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ status: 401, message: "all fields required" });
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      res.json({ status: 401, message: "email not found" });
    } else {
      if (user.password === md5(password)) {
        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });
        await new Token({ token: refreshToken, userId: user._id }).save();
        res.json({ status: 200, accessToken, refreshToken });
      } else {
        res.json({
          status: 401,
          message: "username or password did not match",
        });
      }
    }
  }
}

//generates new access token
async function newAccessToken(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const refToken = await Token.findOne({ token: token });
    if (!refToken) {
      res.json({ status: 401, message: "something went wrong" });
    } else {
      jwt.verify(refToken.token, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
          res.json({ status: 401, message: err.message });
        } else {
          const accessToken = generateAccessToken({ id: user.id });
          const refreshToken = generateRefreshToken({ id: user.id });
          (async () => {
            await Token.deleteOne({ _id: refToken.id });
            await new Token({ token: refreshToken, userId: user.id }).save();
            res.status(200).json({ accessToken, refreshToken });
          })();
        }
      });
    }
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_SECRET);
}

module.exports = {
  signup,
  login,
  newAccessToken,
};
