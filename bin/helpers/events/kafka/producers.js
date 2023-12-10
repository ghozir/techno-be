const kafka = require('kafka-node');
const logger = require('../../../helpers/utils/logger');
const config = require('../../../infra/configs/global_config');
const client = new kafka.KafkaClient({
  kafkaHost: config.get('/kafkaConfig'),
  autoConnect: true,
  connectRetryOptions: {
    retries: 4,
    minTimeout: 1000,
    maxTimeout: 3000,
    randomize: true
  }
});
const producer = new kafka.HighLevelProducer(client);
const ctx = 'kafka-producer-user';
producer.on('ready', () => {
  logger.log(ctx, 'ready', 'Kafka Producer is connected and ready.');
});

const kafkaSendProducer = (data) => {
  const buffer = new Buffer.from(JSON.stringify(data.body));
  const record = [
    {
      topic: data.topic,
      messages: buffer,
      attributes: 1
    }
  ];
  producer.send(record, (err, data) => {
    if(err) {
      logger.log(ctx, 'producer send error', 'kafka-producer');
    } else {
      logger.log(ctx,`producer send success ${data}`,'kafka-producer');
    }
  });
};

producer.on('error', async (error) => {
  logger.log(ctx, error, 'Kafka Producer Error');
});


module.exports = {
  kafkaSendProducer
};
