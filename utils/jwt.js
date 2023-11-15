const jwt = require("jsonwebtoken");
let { JWT_SECRET_KEY } = process.env;

async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(authorization, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
}

async function JWTSign(user) {
  const token = jwt.sign(user, JWT_SECRET_KEY, { expiresIn: "1h" });
  return token;
}

module.exports = { auth, JWTSign };
