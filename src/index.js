const dotenv = require('dotenv');
const result = dotenv.config();

const { APP_ID } = require('./common/config');

const logger = require('./common/logger');
const routes = require('./routes');
const Mongoose = require('./mongoose');
const Server = require('./Server');

if (result.error) {
  throw result.error;
}

logger.info(result.parsed);
logger.info('APP_ID: %s', APP_ID);

(async function () {
  const mongoose = new Mongoose();
  await mongoose.connect();
  mongoose.loadModels();

  new Server('v1.0.0').router(routes).listen(9000);

  process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
})();
