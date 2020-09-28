const { Schema, model } = require('mongoose');

const Product = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    info: String,
    avg_stars: {
      type: Number,
      default: 0,
    },
    total_reviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    img_url: String,
  },
  { timestamps: true },
);
Product.set('toJSON', {
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
module.exports = model('product', Product);
