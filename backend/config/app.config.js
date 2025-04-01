const path = require('path');

module.exports = {
  PORT: process.env.PORT || 8080,
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
  STORAGE_DIR: process.env.STORAGE_DIR || path.join(__dirname, '../../storage')
};