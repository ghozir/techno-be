const Mongo = require('mongodb').MongoClient;
const _ = require('lodash');
const wrapper = require('../../utils/wrapper');
const logger = require('../../utils/logger');

const connectionPool = [];
const connection = () => {
  const connectionState = { index: null, config: '', db: null };
  return connectionState;
};

const createConnection = async (config) => {
  const options = { poolSize: 50,
    keepAlive: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  try {
    const connection = await Mongo.connect(config, options);
    return wrapper.data(connection);
  } catch (err) {
    logger.log('connection-createConnection', err, 'error');
    return wrapper.error(err.message);
  }
};

const addConnectionPool = (cfg) => {
  const connectionMongo = connection();
  connectionMongo.index = 0;
  connectionMongo.config = cfg;
  if(_.isEmpty(connectionPool.find((obj) => obj.config === cfg))){
    connectionPool.push(connectionMongo);
  }
};

const createConnectionPool = async () => {
  connectionPool.forEach(async (currentConnection, index) => {
    const result = await createConnection(currentConnection.config);
    if (result.err) {
      connectionPool[index].db = currentConnection;
    } else {
      connectionPool[index].db = result.data;
    }
  });
};

const init = (cfg) => {
  addConnectionPool(cfg);
  createConnectionPool();
};

const ifExistConnection = async (config) => {
  let state = {};
  connectionPool.forEach((currentConnection) => {
    if (currentConnection.config === config) {
      state = currentConnection;
    }
    return state;
  });
  if (_.isEmpty(state)) {
    return wrapper.error('Connection Not Exist, Connection Must be Created Before');
  }
  return wrapper.data(state);

};

const isConnected = async (state) => {
  const connection = state.db;
  if (_.isEmpty(connection)) {
    return wrapper.error('Connection Not Found, Connection Must be Created Before');
  }
  return wrapper.data(state);
};

const getConnection = async (config) => {
  let connectionIndex;
  const checkConnection = async () => {
    const result = await ifExistConnection(config);
    if (result.err) {
      return result;
    }
    const connection = await isConnected(result.data);
    connectionIndex = result.data.index;
    return connection;

  };
  const result = await checkConnection();
  if (result.err) {
    const state = await createConnection(config);
    if (state.err) {
      return wrapper.data(connectionPool[connectionIndex]);
    }
    connectionPool[connectionIndex].db = state.data;
    return wrapper.data(connectionPool[connectionIndex]);

  }
  return result;

};

module.exports = {
  init,
  getConnection
};
