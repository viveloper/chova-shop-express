const mongoose = require('mongoose');
const logger = require('./common/logger');
const fs = require('fs');
const { MONGO_URI, NODE_ENV } = require('./common/config');

class Mongoose {
  async connect() {
    if (NODE_ENV === 'local') {
      mongoose.set('debug', true);
    }

    try {
      await mongoose.connect(MONGO_URI, {
        keepAlive: 1,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      logger.info('Database connection successful');
    } catch (err) {
      logger.error(`Database connection error: ${err.message}`);
    }
  }

  async disconnect() {
    try {
      logger.info('Disconnecting MongoDB');
      return await mongoose.disconnect();
    } catch (e) {
      logger.error('Failed to disconnect MongoDB');
    }
  }

  loadModels() {
    const modelPath = `${__dirname}/models`;
    fs.readdirSync(modelPath).forEach((file) => require(modelPath + '/' + file));

    Object.keys(mongoose.models).forEach((model) => logger.info(`[${model}] Model is loaded`));
  }
}

module.exports = Mongoose;
