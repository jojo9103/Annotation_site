// // backend/controllers/annotation.controller.js
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');
// const User = require('../models/user.model');
// const config = require('../config/app.config');

// // 이미지 파일 필터링
// const imageFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb('이미지 파일만 업로드할 수 있습니다.', false);
//   }
// };

// // 업로드 설정
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const userId = req.userId;
//     const userDir = path.join(config.UPLOAD_DIR, userId.toString());
    
//     if (!fs.existsSync(userDir)) {
//       fs.mkdirSync(userDir, { recursive: true });
//     }
    
//     cb(null, userDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   fileFilter: imageFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB 제한
// }).array('files', 1000); // 최대 1000개 파일

// // 폴더 업로드 처리
// exports.uploadFolder = (req, res) => {
//   upload(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).send({ message: `업로드 오류: ${err.message}` });
//     } else if (err) {
//       return res.status(400).send({ message: `파일 업로드 중 오류 발생: ${err}` });
//     }

//     // 업로드된 이미지 파일 목록 반환
//     const files = req.files.map(file => ({
//       name: file.originalname,
//       path: file.path,
//       size: file.size,
//       url: `/api/images/${file.filename}`
//     }));

//     res.status(200).send({
//       message: "파일이 성공적으로 업로드되었습니다.",
//       images: files
//     });
//   });
// };

// // 폴더 내 이미지 파일 가져오기
// exports.getImagesFromFolder = async (req, res) => {
//   try {
//     const { folderPath } = req.body;
    
//     if (!folderPath) {
//       return res.status(400).send({ message: "폴더 경로가 필요합니다." });
//     }

//     // 경로가 유효한지 확인 (보안 고려)
//     const absolutePath = path.resolve(folderPath);
//     if (!fs.existsSync(absolutePath)) {
//       return res.status(404).send({ message: "폴더를 찾을 수 없습니다." });
//     }

//     const files = fs.readdirSync(absolutePath);
//     const imageFiles = files
//       .filter(file => {
//         const ext = path.extname(file).toLowerCase();
//         return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
//       })
//       .map(file => ({
//         name: file,
//         path: path.join(absolutePath, file),
//         url: `/api/images/external?path=${encodeURIComponent(path.join(absolutePath, file))}`
//       }));

//     res.status(200).send(imageFiles);
//   } catch (err) {
//     res.status(500).send({ message: `이미지를 불러오는 중 오류 발생: ${err.message}` });
//   }
// };

// // 이미지 파일 제공
// exports.getImage = (req, res) => {
//   const { filename } = req.params;
//   const userId = req.userId;
//   const filePath = path.join(config.UPLOAD_DIR, userId.toString(), filename);
  
//   if (fs.existsSync(filePath)) {
//     res.sendFile(filePath);
//   } else {
//     res.status(404).send({ message: "이미지 파일을 찾을 수 없습니다." });
//   }
// };

// // 외부 이미지 파일 제공
// exports.getExternalImage = (req, res) => {
//   const { path: imagePath } = req.query;
  
//   if (fs.existsSync(imagePath)) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).send({ message: "이미지 파일을 찾을 수 없습니다." });
//   }
// };

// // 어노테이션 저장
// exports.saveAnnotations = async (req, res) => {
//   try {
//     const { annotations, format } = req.body;
//     const userId = req.userId;

//     if (!annotations || Object.keys(annotations).length === 0) {
//       return res.status(400).send({ message: "어노테이션 데이터가 필요합니다." });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
//     }

//     // 저장 경로 설정
//     const saveDir = path.join(config.STORAGE_DIR, 'users', userId.toString(), 'exports');
//     if (!fs.existsSync(saveDir)) {
//       fs.mkdirSync(saveDir, { recursive: true });
//     }

//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const filePath = path.join(saveDir, `annotations_${timestamp}.${format.toLowerCase()}`);

//     // 어노테이션 데이터 변환
//     const separator = format.toLowerCase() === 'csv' ? ',' : '\t';
//     let content = `filename${separator}class\n`;
    
//     for (const [filename, classId] of Object.entries(annotations)) {
//       content += `${filename}${separator}${classId}\n`;
//     }

//     // 파일 저장
//     fs.writeFileSync(filePath, content, 'utf8');

//     // 사용자 모델에 저장 기록 업데이트
//     user.annotations = user.annotations || [];
//     user.annotations.push({
//       path: filePath,
//       format: format.toLowerCase(),
//       count: Object.keys(annotations).length,
//       createdAt: new Date()
//     });
//     await user.save();

//     res.status(200).send({
//       message: `어노테이션이 ${format.toUpperCase()} 형식으로 저장되었습니다.`,
//       filePath: filePath
//     });
//   } catch (err) {
//     res.status(500).send({ message: `어노테이션 저장 중 오류 발생: ${err.message}` });
//   }
// };

// // 사용자 어노테이션 목록 가져오기
// exports.getUserAnnotations = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
//     }

//     res.status(200).send(user.annotations || []);
//   } catch (err) {
//     res.status(500).send({ message: `어노테이션 목록을 가져오는 중 오류 발생: ${err.message}` });
//   }
// };

// // 특정 어노테이션 파일 다운로드
// exports.downloadAnnotation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.userId;
//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
//     }

//     const annotation = user.annotations.find(ann => ann._id.toString() === id);
//     if (!annotation) {
//       return res.status(404).send({ message: "어노테이션 파일을 찾을 수 없습니다." });
//     }

//     if (!fs.existsSync(annotation.path)) {
//       return res.status(404).send({ message: "어노테이션 파일이 존재하지 않습니다." });
//     }

//     const filename = path.basename(annotation.path);
//     res.download(annotation.path, filename);
//   } catch (err) {
//     res.status(500).send({ message: `어노테이션 다운로드 중 오류 발생: ${err.message}` });
//   }
// };
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const User = require('../models/user.model');
const config = require('../config/app.config');

// 이미지 파일 필터링
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('이미지 파일만 업로드할 수 있습니다.', false);
  }
};

// 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId;
    const userDir = path.join(config.UPLOAD_DIR, userId.toString());
    
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB 제한
}).array('files', 1000); // 최대 1000개 파일

// 폴더 업로드 처리
exports.uploadFolder = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ message: `업로드 오류: ${err.message}` });
    } else if (err) {
      return res.status(400).send({ message: `파일 업로드 중 오류 발생: ${err}` });
    }

    // 업로드된 이미지 파일 목록 반환
    const files = req.files.map(file => ({
      name: file.originalname,
      path: file.path,
      size: file.size,
      url: `/api/images/${file.filename}`
    }));

    res.status(200).send({
      message: "파일이 성공적으로 업로드되었습니다.",
      images: files
    });
  });
};

// 폴더 내 이미지 파일 가져오기
exports.getImagesFromFolder = async (req, res) => {
  try {
    const { folderPath } = req.body;
    
    if (!folderPath) {
      return res.status(400).send({ message: "폴더 경로가 필요합니다." });
    }

    // 경로가 유효한지 확인 (보안 고려)
    const absolutePath = path.resolve(folderPath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).send({ message: "폴더를 찾을 수 없습니다." });
    }

    const files = fs.readdirSync(absolutePath);
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
      })
      .map(file => ({
        name: file,
        path: path.join(absolutePath, file),
        url: `/api/images/external?path=${encodeURIComponent(path.join(absolutePath, file))}`
      }));

    res.status(200).send(imageFiles);
  } catch (err) {
    res.status(500).send({ message: `이미지를 불러오는 중 오류 발생: ${err.message}` });
  }
};

// 이미지 파일 제공
exports.getImage = (req, res) => {
  const { filename } = req.params;
  const userId = req.userId;
  const filePath = path.join(config.UPLOAD_DIR, userId.toString(), filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send({ message: "이미지 파일을 찾을 수 없습니다." });
  }
};

// 외부 이미지 파일 제공
exports.getExternalImage = (req, res) => {
  const { path: imagePath } = req.query;
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send({ message: "이미지 파일을 찾을 수 없습니다." });
  }
};

// 어노테이션 저장
exports.saveAnnotations = async (req, res) => {
  try {
    const { annotations, notes, format } = req.body;
    const userId = req.userId;

    if (!annotations || Object.keys(annotations).length === 0) {
      return res.status(400).send({ message: "어노테이션 데이터가 필요합니다." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }

    // 저장 경로 설정
    const saveDir = path.join(config.STORAGE_DIR, 'users', userId.toString(), 'exports');
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(saveDir, `annotations_${timestamp}.${format.toLowerCase()}`);

    // 어노테이션 데이터 변환
    const separator = format.toLowerCase() === 'csv' ? ',' : '\t';
    let content = `filename${separator}class${separator}notes\n`;
    
    for (const [filename, classId] of Object.entries(annotations)) {
      const note = notes && notes[filename] ? notes[filename].replace(/\n/g, ' ') : '';
      content += `${filename}${separator}${classId}${separator}"${note}"\n`;
    }

    // 파일 저장
    fs.writeFileSync(filePath, content, 'utf8');

    // 사용자 모델에 저장 기록 업데이트
    user.annotations = user.annotations || [];
    user.annotations.push({
      path: filePath,
      format: format.toLowerCase(),
      count: Object.keys(annotations).length,
      createdAt: new Date()
    });
    
    // 마지막 어노테이션 데이터 저장
    user.lastAnnotations = {
      annotations,
      notes
    };
    
    await user.save();

    res.status(200).send({
      message: `어노테이션이 ${format.toUpperCase()} 형식으로 저장되었습니다.`,
      filePath: filePath
    });
  } catch (err) {
    res.status(500).send({ message: `어노테이션 저장 중 오류 발생: ${err.message}` });
  }
};

// 사용자 어노테이션 목록 가져오기
exports.getUserAnnotations = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }

    // 이전에 저장된 어노테이션 데이터 반환
    res.status(200).send({
      annotations: user.lastAnnotations?.annotations || {},
      notes: user.lastAnnotations?.notes || {},
      history: user.annotations || []
    });
  } catch (err) {
    res.status(500).send({ message: `어노테이션 목록을 가져오는 중 오류 발생: ${err.message}` });
  }
};

// 특정 어노테이션 파일 다운로드
exports.downloadAnnotation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }

    const annotation = user.annotations.find(ann => ann._id.toString() === id);
    if (!annotation) {
      return res.status(404).send({ message: "어노테이션 파일을 찾을 수 없습니다." });
    }

    if (!fs.existsSync(annotation.path)) {
      return res.status(404).send({ message: "어노테이션 파일이 존재하지 않습니다." });
    }

    const filename = path.basename(annotation.path);
    res.download(annotation.path, filename);
  } catch (err) {
    res.status(500).send({ message: `어노테이션 다운로드 중 오류 발생: ${err.message}` });
  }
};