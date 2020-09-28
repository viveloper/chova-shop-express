const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.send({
    response: new Date().toISOString(),
    success: true,
  });
});

module.exports = router;
