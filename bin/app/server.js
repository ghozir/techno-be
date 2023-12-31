const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware2');
const project = require('../../package.json');
const basicAuth = require('../auth/basic_auth_helper');
const jwtAuth = require('../auth/jwt_auth_helper');
const wrapper = require('../helpers/utils/wrapper');
const mongoConnectionPooling = require('../helpers/databases/mongodb/connection');
const config = require('../infra/configs/global_config');

const authUser = require('./routes/authUser');
class AppServer {
  constructor() {
    this.server = restify.createServer({
      name: `${project.name}-server`,
      version: project.version
    });

    this.server.serverKey = '';
    this.server.use(restify.plugins.acceptParser(this.server.acceptable));
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());
    this.server.use(restify.plugins.authorizationParser());

    // required for CORS configuration
    const corsConfig = corsMiddleware({
      preflightMaxAge: 5,
      origins: ['*'],
      // ['*'] -> to expose all header, any type header will be allow to access
      // X-Requested-With,content-type,GET, POST, PUT, PATCH, DELETE, OPTIONS -> header type
      allowHeaders: ['Authorization'],
      exposeHeaders: ['Authorization']
    });
    this.server.pre(corsConfig.preflight);
    this.server.use(corsConfig.actual);

    // // required for basic auth
    this.server.use(basicAuth.init());

    // anonymous can access the end point, place code bellow
    this.server.get('/', (req, res) => {
      wrapper.response(res, 'success', wrapper.data(null), 'This service is running properly');
    });

    // routes
    authUser.init(this.server, jwtAuth, basicAuth);
    // helpers initiation
    mongoConnectionPooling.init(`${config.get('/mongoDbUrl')}?authSource=admin`);
    mongoConnectionPooling.init(`${config.get('/mongoDbAuthUrl')}?authSource=admin`);
  }
}

module.exports = AppServer;
