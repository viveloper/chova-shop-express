const user = require('../../controllers/user');
const product = require('../../controllers/product');
const category = require('../../controllers/category');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const passport = require('../../common/passport');
const adminGuard = require('../../common/guard').guard('/admin/login');

const router = require('express').Router();

router.get('/', adminGuard, (req, res) => {
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  res.render('pages/login', { errorMessage: req.flash('loginErrorMessage') });
});

router.post(
  '/login',
  passport.authenticate('admin', {
    successRedirect: '/admin/',
    failureRedirect: '/admin/login',
    failureFlash: true,
  }),
);

router.get('/user', adminGuard, user.getUsers);
router.post('/user', adminGuard, user.createUser);
router.get('/user/export-csv', adminGuard, user.exportToCsv);
router.get('/user/:userId', adminGuard, user.getUser);
router.put('/user/:userId', adminGuard, user.saveUser);
router.delete('/user/:userId', adminGuard, user.deleteUser);

router.get('/product', adminGuard, product.getProductList);
router.post('/product', adminGuard, upload.single('image'), product.createProduct);
router.get('/product/:productId', adminGuard, product.getProduct);
router.post('/product/:productId', adminGuard, upload.single('image'), product.saveProduct);
router.delete('/product/:productId', adminGuard, product.deleteProduct);

router.get('/category', adminGuard, category.getCategoryList);
router.post('/category', adminGuard, category.createCategory);
router.get('/category/:categoryId', adminGuard, category.getCategroy);
router.put('/category/:categoryId', adminGuard, category.saveCategroy);
router.delete('/category/:categoryId', adminGuard, category.deleteCategory);

module.exports = router;
