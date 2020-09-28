const adminApis = require('./admin');
const v1Apis = require('./v1');
const hcheck = require('./hcheck');

module.exports = function routes(app) {
  app.use('/api/_hcheck', hcheck);
  app.use('/api/v1', v1Apis);
  app.use('/admin/', adminApis);
};
