module.exports = {
  guard: (redirectPath) => (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect(redirectPath); // if not auth
  },
};
