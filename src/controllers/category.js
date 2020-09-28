const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategoryList = (req, res, next) => {
  res.format({
    html() {
      Category.find().exec((err, categories) => {
        if (err) next(err);
        res.render('pages/category/list', { categories });
      });
    },
    async json() {
      try {
        const [productByCategory, categories] = await Promise.all([
          Product.aggregate()
            .group({ _id: '$category', count: { $sum: 1 } })
            .exec(),
          Category.find().lean().exec(),
        ]);

        const result = categories.map((c) => {
          const found = productByCategory.find((p) => p._id.equals(c._id));
          return {
            ...c,
            id: c._id,
            counts: found ? found.count : 0,
          };
        });
        res.send(result);
      } catch (e) {
        next(e);
      }
    },
  });
};

const getCategroy = (req, res, next) => {
  const categoryId = req.params.categoryId;

  if (categoryId === 'new') {
    res.render('pages/category/new');
    return;
  }
  Category.findById(categoryId).exec((err, category) => {
    if (!category) next(new Error('카테고리를 찾을 수 없습니다.'));
    res.render('pages/category/edit', { category });
  });
};

const createCategory = async (req, res, next) => {
  try {
    await new Category({
      name: req.body.name,
    }).save();
  } catch (e) {
    next(e);
  } finally {
    res.redirect(302, '/admin/category');
  }
};

const saveCategroy = (req, res, next) => {
  const id = req.params.categoryId;

  Category.findByIdAndUpdate(id, {
    ...req.body,
  }).exec((err, user) => {
    if (err) next(err);
    if (!user) next(new ApiError('사용자를 찾을 수 없습니다.', 404));

    res.redirect(302, `/admin/category/${id}`);
  });
};

const deleteCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;
  Category.findByIdAndDelete(categoryId, (err, user) => {
    if (err) next(err);
    res.redirect(302, '/admin/category');
  });
};

module.exports = {
  getCategoryList,
  getCategroy,
  saveCategroy,
  deleteCategory,
  createCategory,
};
