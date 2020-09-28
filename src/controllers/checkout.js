const Order = require('../models/Order');
const ApiError = require('../errors/ApiError');

exports.checkout = async (req, res, next) => {
  try {
    const order = await new Order({
      ...req.body,
    }).save();

    res.send({
      message: 'Order genderated',
      data: {
        orderId: order.id,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
