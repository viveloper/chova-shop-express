const router = require('express').Router();
const product = require('../../controllers/product');
const category = require('../../controllers/category');
const { saveUser, getMe } = require('../../controllers/user');
const { auth } = require('../../controllers/auth');
const { checkout } = require('../../controllers/checkout');
const passport = require('../../common/passport');

router.post('/auth', auth);

router.post('/user/join', saveUser);

router.post('/user/me', passport.authenticate('jwt', { session: false }), getMe);

router.get('/product', product.getProductList);
router.get('/product/:productId', product.getProduct);
router.get('/product/:productId/related', product.getProductList);

router.get('/category', category.getCategoryList);

router.post('/checkout', passport.authenticate('jwt', { session: false }), checkout);

module.exports = router;
