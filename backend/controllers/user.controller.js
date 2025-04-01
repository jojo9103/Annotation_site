// backend/controllers/user.controller.js
const User = require('../models/user.model');

// 사용자 프로필 정보 가져오기
exports.getUserProfile = async (req, res) => {
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

// 사용자 프로필 정보 업데이트
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { email } = req.body;
    
    // 이메일이 이미 사용 중인지 확인
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).send({ message: "이미 사용 중인 이메일입니다." });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }
    
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};