const { Schema, model } = require('mongoose');

const Category = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);
module.exports = model('category', Category);
