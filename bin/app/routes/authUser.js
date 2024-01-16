const handler = require('../../modules/authUser/handlers/api_handler');
// const pooling = require('./mongodb_pooling');

const init = (router, jwtAuth, basicAuth) => {
  router.post('/admin/injectAdmin', basicAuth.isAuthenticated, handler.injectAdmin);
  router.post('/user/login', basicAuth.isAuthenticated, handler.login);
  router.post('/user/logout', jwtAuth.verifyToken, handler.logout);
  router.get('/user/status', jwtAuth.verifyToken, handler.getInfo);
  router.post('/user/forget-password',  basicAuth.isAuthenticated, handler.forgetPass);
  router.post('/user/insert-data', handler.insertDegree);
};

module.exports = {
  init
};
