const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET } = require('./config');
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true,
};

passport.use(
  'jwt',
  new JwtStrategy(opts, (req, jwt_payload, done) => {
    User.findById(jwt_payload.sub).exec((err, user) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  }),
);

passport.use(
  'admin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email }).exec();
        if (user == null) {
          return done(null, false, req.flash('loginErrorMessage', '사용자를 찾을 수 없거나 패스워드가 틀렸습니다.'));
        }
        const result = await user.checkPassword(password);
        if (result) {
          await user.increaseLoginCount();
          return done(null, user);
        } else {
          return done(null, false, req.flash('loginErrorMessage', '사용자를 찾을 수 없거나 패스워드가 틀렸습니다.'));
        }
      } catch (error) {
        return done(null, false, req.flash('loginErrorMessage', error.message));
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return done(err);
    }
    done(err, user);
  });
});

module.exports = passport;
