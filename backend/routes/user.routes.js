const verifyToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/user.controller');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/users/profile', verifyToken, controller.getUserProfile);
  app.put('/api/users/profile', verifyToken, controller.updateUserProfile);
};
