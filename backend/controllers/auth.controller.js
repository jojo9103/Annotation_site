// backend/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const config = require('../config/auth.config');

// 회원가입
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 사용자 이름 중복 확인
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: "이미 사용 중인 사용자 이름입니다." });
    }
    
    // 이메일 중복 확인
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ message: "이미 사용 중인 이메일입니다." });
    }
    
    // 비밀번호 해싱
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    // 새 사용자 생성
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    res.status(201).send({ message: "사용자가 성공적으로 등록되었습니다." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 로그인
// backend/controllers/auth.controller.js의 signin 함수
exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 사용자 찾기
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }
    
    // 비밀번호 검증 - 이 부분이 올바르게 작동하는지 확인
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "비밀번호가 올바르지 않습니다."
      });
    }
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id },
      config.secret,
      { expiresIn: 86400 } // 24시간
    );
    
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 사용자 정보 가져오기
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }
    
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};





