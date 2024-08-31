const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Received token:", token);
  if (!token) {
    console.log("No token provided in the request.");
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user.id;
    console.log("Token verified successfully. User ID:", req.user);
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(500).send("Error verifying token: " + error.message);
  }
};

module.exports = auth;
