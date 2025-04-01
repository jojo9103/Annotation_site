// backend/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/user.model');

// JWT 토큰 검증 미들웨어
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).send({ message: "토큰이 제공되지 않았습니다." });
  }
  
  try {
    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send({ message: "인증되지 않았습니다." });
  }
};

module.exports = verifyToken;