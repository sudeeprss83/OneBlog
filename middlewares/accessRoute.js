const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
      if (err) {
        res.json({ status: 401, message: err.message });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.json({ status: 401, message: "Please login to access this route" });
  }
}

module.exports = { protect };
