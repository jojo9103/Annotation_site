const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dbConfig = require('./config/db.config');
const appConfig = require('./config/app.config');

const app = express();

// CORS 설정
app.use(cors());

// JSON 요청 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 필요한 디렉토리 생성
const ensureDirectories = () => {
  const dirs = [
    appConfig.UPLOAD_DIR,
    appConfig.STORAGE_DIR,
    path.join(appConfig.STORAGE_DIR, 'users'),
    path.join(appConfig.STORAGE_DIR, 'exports')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectories();

// 데이터베이스 연결
mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB에 성공적으로 연결되었습니다.");
})
.catch(err => {
  console.error("데이터베이스 연결 오류:", err);
  process.exit();
});

// 라우트 설정
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/annotation.routes')(app);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: "패치 어노테이션 시스템 API 서버에 오신 것을 환영합니다." });
});

// 서버 시작
const PORT = appConfig.PORT;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
