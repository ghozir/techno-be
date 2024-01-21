
const Techno = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');

const getData = async (payload) => {
  const db = new Mongo(`${config.get('/mongoDbAuthUrl')}?authSource=admin`, 'techo');
  const auth = new Techno(db);
  const postCommand = async () => await auth.getData(payload);
  return await postCommand();
};

module.exports = {
  getData
};
