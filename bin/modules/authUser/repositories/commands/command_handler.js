
const AuthUser = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const Redis = require('../../../../helpers/cache/redis/common');
const config = require('../../../../infra/configs/global_config');
const mailService = require('../../../../helpers/services/nodemailer');
const redis = new Redis(config.get('/redisConfig'));

const InjectAdmin = async (payload) => {
  const db = new Mongo(`${config.get('/mongoDbAuthUrl')}?authSource=admin`, 'techo');
  const auth = new AuthUser(redis, db);
  const postCommand = async () => await auth.injectRoot(payload);
  return await postCommand();
};

const login = async (payload) => {
  const db = new Mongo(`${config.get('/mongoDbAuthUrl')}?authSource=admin`, 'techo');
  const auth = new AuthUser(redis, db);
  const postCommand = async () => await auth.login(payload);
  return await postCommand();
};

const logout = async (cacheKey) => {
  const auth = new AuthUser(redis);
  const postCommand = async () => await auth.logout(cacheKey);
  return await postCommand();
};

const forgetPass = async (payload) => {
  const db = new Mongo(`${config.get('/mongoDbAuthUrl')}?authSource=admin`, 'techo');
  const auth = new AuthUser(redis, db, mailService);
  const postCommand = async () => await auth.forgetPass(payload);
  return await postCommand();
};

// const changePass = async (payload) => {
//   const db = new Mongo(config.get('/mongoDbUrl'));
//   const teacher = new Teacher(http, redis, config, db);
//   const postCommand = async () => await teacher.changePass(payload);
//   return await postCommand();
// };
module.exports = {
  InjectAdmin,
  login,
  logout,
  forgetPass
//   changePass,
  // check
};
