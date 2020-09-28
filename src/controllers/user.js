const logger = require('../common/logger');
const ApiError = require('../errors/ApiError');
const CsvWriter = require('../common/csv-write-stream');
const User = require('../models/User');
const { Stream } = require('../common/csv-write-stream');

const getUsers = (req, res, next) => {
  User.find().exec((err, users) => {
    res.render('pages/user/list', { users });
  });
};

const getUser = (req, res, next) => {
  const userId = req.params.userId;

  if (userId === 'new') {
    res.render('pages/user/new');
    return;
  }

  User.findById(userId).exec((err, user) => {
    if (err) return next(err);
    if (!user) return next(new ApiError('사용자를 찾을 수 없습니다.', 404));

    res.render('pages/user/edit', { user });
  });
};

const getMe = (req, res, next) => {
  res.send(req.user);
};

const saveUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(userId).exec();

    if (!user) return next(new ApiError('사용자를 찾을 수 없습니다.', 404));

    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();
    res.redirect(302, `/admin/user/${userId}`);
  } catch (error) {
    next(error);
  }
};

const deleteUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findByIdAndDelete(userId, (err, user) => {
    if (err) next(err);
    res.redirect(302, '/admin/user');
  });
};

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    await new User({
      name,
      email,
      password,
    }).save();
  } catch (e) {
    next(e);
  } finally {
    res.redirect(302, '/admin/user');
  }
};

const exportToCsv = (req, res, next) => {
  res.setHeader('Content-type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment; filename=user.csv');

  const cursor = User.find().lean().cursor();
  const csvWriter = new CsvWriter();

  Stream.Readable.from(cursor).pipe(csvWriter).pipe(res);
};

module.exports = {
  getUsers,
  getUser,
  saveUser,
  deleteUser,
  createUser,
  exportToCsv,
  getMe,
};
