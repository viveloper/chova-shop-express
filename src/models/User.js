const { Schema, model } = require('mongoose');
const { PASSWORD_SALT_HASH } = require('../common/config');
const bcrypt = require('bcrypt');
const logger = require('../common/logger');

const User = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

User.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(PASSWORD_SALT_HASH, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

User.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.methods.increaseLoginCount = async function () {
  return await this.updateOne({ $inc: { loginCount: 1 } });
};

module.exports = model('user', User);
