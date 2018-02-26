import { IS_TESTNET } from '../../constant';

const PubSub = require('@google-cloud/pubsub');
const uuidv4 = require('uuid/v4');

const config = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const pubsub = new PubSub();
const topics = [
  'misc',
];
const publisher = {};
const publisherWrapper = {};
const ethNetwork = IS_TESTNET ? 'rinkeby' : 'mainnet';

topics.forEach((topic) => {
  publisherWrapper[topic] = pubsub.topic(topic)
    .publisher({
      batching: {
        maxMessages: config.GCLOUD_PUBSUB_MAX_MESSAGES || 10,
        maxMilliseconds: config.GCLOUD_PUBSUB_MAX_WAIT || 1000,
      },
    });
});

publisher.publish = (publishTopic, obj) => {
  Object.assign(obj, {
    '@timestamp': new Date().toISOString(),
    appServer: config.APP_SERVER || 'store',
    ethNetwork,
    uuidv4: uuidv4(),
  });

  const data = JSON.stringify(obj);
  const dataBuffer = Buffer.from(data);
  publisherWrapper[publishTopic].publish(dataBuffer)
    .catch((err) => {
      console.error('ERROR:', err);
    });
};

export { publisher };
