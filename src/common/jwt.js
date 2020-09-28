const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

function issueJWT(user) {
  const id = user.id;
  const expiresIn = '1d';

  const payload = {
    sub: id,
    name: user.name,
    email: user.email,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn });
  return {
    apiToken: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
}

module.exports = {
  issueJWT,
};
