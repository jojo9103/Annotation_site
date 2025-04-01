const verifyToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/annotation.controller');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/api/annotations/upload', verifyToken, controller.uploadFolder);
  app.post('/api/annotations/folder', verifyToken, controller.getImagesFromFolder);
  app.post('/api/annotations/save', verifyToken, controller.saveAnnotations);
  app.get('/api/annotations/list', verifyToken, controller.getUserAnnotations);
  app.get('/api/annotations/download/:id', verifyToken, controller.downloadAnnotation);
  app.get('/api/images/:filename', verifyToken, controller.getImage);
  app.get('/api/images/external', verifyToken, controller.getExternalImage);
};