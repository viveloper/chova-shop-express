const logger = require('../common/logger');
const ApiError = require('../errors/ApiError');
const Product = require('../models/Product');
const Category = require('../models/Category');
const _ = require('lodash');
const { IMG_URL_ROOT } = require('../common/config');

const getProductList = (req, res, next) => {
  const categoryId = req.query.categoryId;
  const gtePrice = req.query.gtePrice;
  const ltePrice = req.query.ltePrice;
  const sortBy = req.query.sortBy;
  const query = {
    ...(categoryId && { category: categoryId }),
    ...(gtePrice &&
      ltePrice && {
        price: {
          $gte: gtePrice,
          $lte: ltePrice,
        },
      }),
  };
  Product.find(query)
    .sort({
      ...(sortBy ? { [sortBy]: -1 } : { updatedAt: 1 }),
    })
    .exec((err, products) => {
      res.render('pages/product/list', { products });
    });
};

const getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  if (productId === 'new') {
    Category.find().exec((err, categories) => {
      res.render('pages/product/new', { categories });
    });
  } else {
    res.format({
      async html() {
        try {
          const [categories, product] = await Promise.all([Category.find(), Product.findById(productId)]);
          if (!product) next(new Error('상품을 찾을 수 없습니다.'));
          res.render('pages/product/edit', { product, categories });
        } catch (e) {
          next(e);
        }
      },
      async json() {
        try {
          const product = await Product.findById(productId).populate('category').exec();
          if (!product) next(new Error('상품을 찾을 수 없습니다.'));
          res.send(product);
        } catch (e) {
          next(e);
        }
      },
    });
  }
};

const saveProduct = (req, res, next) => {
  const productId = req.params.productId;
  const img_url = req.file ? `${IMG_URL_ROOT}/${req.file.path}` : null;

  const toUpdate = _.pickBy(
    {
      ...req.body,
      img_url,
    },
    _.identity,
  );

  Product.findByIdAndUpdate(productId, toUpdate, {
    setDefaultsOnInsert: true,
  }).exec((err, user) => {
    if (err) next(err);
    if (!user) next(new ApiError('상품을 찾을 수 없습니다.', 404));

    res.redirect(302, `/admin/product/${productId}`);
  });
};

const createProduct = async (req, res, next) => {
  const img_url = req.file ? `${IMG_URL_ROOT}/${req.file.path}` : null;

  try {
    await new Product(
      _.pickBy(
        {
          ...req.body,
          img_url,
        },
        _.identity,
      ),
    ).save();
  } catch (e) {
    next(e);
  } finally {
    res.redirect(302, '/admin/product');
  }
};

const deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByIdAndDelete(productId, (err, _) => {
    if (err) next(err);
    res.redirect(302, '/admin/product');
  });
};

module.exports = {
  getProductList,
  getProduct,
  saveProduct,
  createProduct,
  deleteProduct,
};
