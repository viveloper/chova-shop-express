const { Schema, model } = require('mongoose');

const Order = new Schema(
  {
    customer: {
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    orderNote: String,
    address: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      postCode: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      default: 'ORDER_ACCEPTED', // ORDER_ACCEPTED -> CARD_APPROVED -> SHIPPING -> FINISHED
    },
    payment: {
      cardNumber: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      expDate: {
        type: String,
        required: true,
      },
      cvc: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);
module.exports = model('order', Order);
