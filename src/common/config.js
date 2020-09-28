module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  APP_ID: process.env.APP_ID,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  IMG_URL_ROOT: process.env.IMG_URL_ROOT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
  PASSWORD_SALT_HASH: process.env.PASSWORD_SALT_HASH ? Number(process.env.PASSWORD_SALT_HASH) : 10,
};
