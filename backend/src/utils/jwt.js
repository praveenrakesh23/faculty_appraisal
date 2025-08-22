const jwt = require("jsonwebtoken");

const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

exports.signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });

exports.signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: REFRESH_EXPIRES });

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
