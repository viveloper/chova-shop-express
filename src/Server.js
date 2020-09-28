const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('./common/logger');
const pino = require('express-pino-logger')({
  logger,
  useLevel: 'debug',
});
const { NODE_ENV, APP_ID, SESSION_COOKIE_SECRET } = require('./common/config');
const methodOverride = require('method-override');
const ApiError = require('./errors/ApiError.js');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./common/passport');
const flash = require('connect-flash');

const app = express();

module.exports = class Server {
  constructor(version) {
    this.version = version;
    app.use(pino);

    app.set('view engine', 'ejs'); // 사용할 템플릿 엔진
    app.set('views', path.resolve(`${__dirname}/views`)); // 렌더링할 파일 경로

    app.use(express.static(`${__dirname}/public`));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());
    app.use(
      session({ secret: SESSION_COOKIE_SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.use(cors());
    app.use(methodOverride('_method'));
  }

  static errorHandling(express) {
    express.use('*', (req, res, next) => {
      const err = new ApiError('Not found', 404);
      next(err);
    });
    express.use((err, req, res, next) => {
      logger.error(err);
      if (err.status && err.status === 404) {
        res.render('pages/404');
      } else {
        res.status(err.status || 500).send({ message: err.message });
      }
    });
  }

  static fileDownloadHandling(express) {
    express.get('/uploads/:fileName', (req, res) => {
      const fileName = req.params.fileName;
      res.sendFile(path.join(__dirname, `../uploads/${fileName}`));
    });
  }

  router(routes) {
    routes(app);
    Server.fileDownloadHandling(app);
    Server.errorHandling(app);
    return this;
  }

  listen(port) {
    const welcome = (p) => () =>
      logger.info(`${APP_ID}: ${this.version} is up and running in NODE_ENV:${NODE_ENV} on port: ${p}`);
    this.server = http.createServer(app).listen(port, welcome(port));
    return this;
  }
};
