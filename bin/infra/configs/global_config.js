require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  appEnv: process.env.APP_ENV,
  timezone: process.env.TZ,
  basicAuthApi: [
    {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD
    }
  ],
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  },
  publicKey: process.env.PUBLIC_KEY_PATH,
  privateKey: process.env.PRIVATE_KEY_PATH,
  dsnSentryUrl: process.env.DSN_SENTRY_URL,
  mongoDbUrl: process.env.MONGO_DATABASE_URL,
  mongoDbAuthUrl: process.env.MONGO_DATABASE_AUTH_URL,
  mysqlConfig: {
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  },
  redisConfig: {
    host: process.env.REDIS_HOST || undefined,
    port: parseInt(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || 0),
  },
  // postgreConfig:{
  //   host: process.env.POSTGRES_HOST,
  //   user: process.env.POSTGRES_USER,
  //   password: process.env.POSTGRES_PASSWORD,
  //   database: process.env.POSTGRES_DATABASE,
  //   port: process.env.POSTGRES_PORT,
  //   max:  process.env.POSTGRES_MAX,
  //   idleTimeoutMillis: process.env.POSTGRES_TIMEOUT
  // },
  elasticsearch: {
    connectionClass: process.env.ELASTICSEARCH_CONNECTION_CLASS || '',
    apiVersion: process.env.ELASTICSEARCH_API_VERSION,
    host: process.env.ELASTICSEARCH_HOST ? [
      process.env.ELASTICSEARCH_HOST
    ] : null,
    maxRetries: process.env.ELASTICSEARCH_MAX_RETRIES,
    requestTimeout: process.env.ELASTICSEARCH_REQUEST_TIMEOUT
  },
  // logstash: {
  //   host: process.env.LOGSTASH_HOST,
  //   port: process.env.LOGSTASH_PORT,
  //   applicationName: 'codebase-backend',
  //   sslEnable: false,
  //   maxConnectRetries: 10
  // },
  kafkaConfig: process.env.KAFKA_HOST_URL,
  apm: {
    url: process.env.APM_SERVICE_URL,
    transaction: process.env.APM_TRANSACTION,
    appName: process.env.APM_SERVICE_NAME
  },
  instances: process.env.PM2_INSTANCE || 2,
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
