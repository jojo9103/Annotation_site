// // backend/models/user.model.js
// const mongoose = require('mongoose');

// const User = mongoose.model(
//   'User',
//   new mongoose.Schema({
//     username: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     annotations: [{
//       path: String,
//       format: String,
//       count: Number,
//       createdAt: Date
//     }],
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   })
// );

// module.exports = User;
// backend/models/user.model.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  annotations: [{
    path: String,
    format: String,
    count: Number,
    createdAt: Date
  }],
  // 마지막 어노테이션 데이터 저장
  lastAnnotations: {
    annotations: {
      type: Map,
      of: Number,
      default: {}
    },
    notes: {
      type: Map,
      of: String,
      default: {}
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
  