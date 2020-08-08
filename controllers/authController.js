const jwt = require("jsonwebtoken");
const md5 = require("md5");

const User = require("../models/user");
const Token = require("../models/token");

async function signup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(401).json({ message: "all fields required" });
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
      res.status(401).json({ message: "user already exits" });
    }
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({ message: "all fields required" });
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "email not found" });
    } else {
      if (user.password === md5(password)) {
        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });
        await new Token({ token: refreshToken, userId: user._id }).save();
        res.status(200).json({ accessToken, refreshToken });
      } else {
        res.status(401).json({ message: "username or password did not match" });
      }
    }
  }
}

async function logout(req, res) {
  await Token.deleteOne({ userId: req.user.id });
  res.status(200).json({ message: "user logged out" });
}

async function newAccessToken(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const refToken = await Token.findOne({ token: token });
    if (!refToken) {
      res.status(401).json({ message: "something went wrong" });
    } else {
      jwt.verify(refToken.token, process.env.REFRESH_SECRET, (err, user) => {
        console.log(refToken);
        if (err) {
          res.status(401).json({ message: err.message });
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
  logout,
  newAccessToken,
};
