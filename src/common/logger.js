const pino = require('pino');
const { APP_ID, LOG_LEVEL } = require('./config');

const options = {
  name: APP_ID,
  level: LOG_LEVEL || 'error',
  formatters: {
    bindings(bindings) {
      // return { pid: bindings.pid, hostname: bindings.hostname };
      return { pid: bindings.pid };
    },
  },
};

const logger = pino(options);

module.exports = logger;
