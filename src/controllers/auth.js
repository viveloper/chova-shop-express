const User = require('../models/User');
const { issueJWT } = require('../common/jwt');
const ApiError = require('../errors/ApiError');

const errorMessage = '사용자를 찾을 수 없거나 패스워드가 틀렸습니다.';

exports.auth = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (user == null) {
      return next(new ApiError(errorMessage, 402));
    }
    const result = await user.checkPassword(password);
    if (result) {
      const tokenObject = issueJWT(user);
      await user.increaseLoginCount();
      res.send(tokenObject);
    } else {
      next(new ApiError(errorMessage, 402));
    }
  } catch (error) {
    next(error);
  }
};
