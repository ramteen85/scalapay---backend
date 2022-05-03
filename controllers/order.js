const config = require('../config');
const Order = require('../models/order');
const User = require('../models/user');
const axios = require('axios');

exports.getOrderInfo = async (req, res, next) => {
  try {
    // get user
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });

    // check user exists
    if (!user) {
      const error = {
        statusCode: 500,
        message: 'User not found',
      };
      next(error);
    }

    let shippingInfo = {
      shipping: user.shipping,
      billing: user.billing,
      consumer: user.consumer,
    };

    res.status(200).json({
      message: 'Got Order Info!',
      shippingInfo,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

exports.getAllOrders = async function (req, res, next) {
  try {
    // get user id
    const userId = req.userId;

    // fetch Orders
    const orders = await Order.find({ account: userId });

    // Remap Orders to limit data being returned
    let orderData = orders.map((ord) => ({
      amount: ord.totalAmount.amount,
      name: ord.consumer.givenNames + ' ' + ord.consumer.surname,
      billing: ord.billing.line1 + ', ' + ord.billing.suburb + ' ' + ord.billing.postcode,
      items: ord.items,
      shippingAmount: ord.shippingAmount.amount,
    }));

    // relay response back to client
    res.status(200).json({
      message: 'Fetched orders for user!',
      orders: orderData,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    // grab payload
    const userId = req.userId; // from middleware
    const payload = req.body.payload;

    // do validation

    if (!userId) {
      const error = {
        statusCode: 401,
        message: 'Token expired',
      };
      next(error);
      return;
    }

    // check all required fields
    // totalAmount
    if (!payload.totalAmount.amount || payload.totalAmount.amount === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: totalAmount - amount',
      };
      next(error);
      return;
    }
    if (!payload.totalAmount.currency || payload.totalAmount.currency === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: totalAmount - currency',
      };
      next(error);
      return;
    }
    // consumer
    if (!payload.consumer.phoneNumber || payload.consumer.phoneNumber === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: consumer - phoneNumber',
      };
      next(error);
      return;
    }
    if (!payload.consumer.givenNames || payload.consumer.givenNames === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: consumer - givenNames',
      };
      next(error);
      return;
    }
    if (!payload.consumer.surname || payload.consumer.surname === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: consumer - surname',
      };
      next(error);
      return;
    }
    if (!payload.consumer.email || payload.consumer.email === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: consumer - email',
      };
      next(error);
      return;
    }
    // billing
    if (!payload.billing.phoneNumber || payload.billing.phoneNumber === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: billing - phoneNumber',
      };
      next(error);
      return;
    }
    if (!payload.billing.countryCode || payload.billing.countryCode === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: billing - countryCode',
      };
      next(error);
      return;
    }
    if (!payload.billing.name || payload.billing.name === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: billing - name',
      };
      next(error);
      return;
    }
    if (!payload.billing.postcode || payload.billing.postcode === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: billing - postcode',
      };
      next(error);
      return;
    }
    if (!payload.billing.suburb || payload.billing.suburb === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: billing - suburb',
      };
      next(error);
      return;
    }
    if (!payload.billing.line1 || payload.billing.line1 === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: billing - line1',
      };
      next(error);
      return;
    }
    // shipping
    if (!payload.shipping.phoneNumber || payload.shipping.phoneNumber === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shipping - phoneNumber',
      };
      next(error);
      return;
    }
    if (!payload.shipping.countryCode || payload.shipping.countryCode === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shipping - countryCode',
      };
      next(error);
      return;
    }
    if (!payload.shipping.name || payload.shipping.name === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shipping - name',
      };
      next(error);
      return;
    }
    if (!payload.shipping.postcode || payload.shipping.postcode === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shipping - postcode',
      };
      next(error);
      return;
    }
    if (!payload.shipping.suburb || payload.shipping.suburb === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shipping - suburb',
      };
      next(error);
      return;
    }
    if (!payload.shipping.line1 || payload.shipping.line1 === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shipping - line1',
      };
      next(error);
      return;
    }
    // merchant
    if (
      !payload.merchant.redirectCancelUrl ||
      payload.merchant.redirectCancelUrl === ''
    ) {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: merchant - redirectCancelUrl',
      };
      next(error);
      return;
    }
    if (
      !payload.merchant.redirectConfirmUrl ||
      payload.merchant.redirectConfirmUrl === ''
    ) {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: merchant - redirectConfirmUrl',
      };
      next(error);
      return;
    }
    // merchant reference
    if (!payload.merchantReference || payload.merchantReference === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: merchantReference',
      };
      next(error);
      return;
    }
    // shipping amount
    if (!payload.shippingAmount.amount || payload.shippingAmount.amount === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shippingAmount - amount',
      };
      next(error);
      return;
    }
    if (!payload.shippingAmount.currency || payload.shippingAmount.currency === '') {
      const error = {
        statusCode: 500,
        message: 'Cannot accept null field: shippingAmount - currency',
      };
      next(error);
      return;
    }

    // check order is not empty
    if (payload.items.length < 1) {
      const error = {
        statusCode: 500,
        message: 'Cannot submit an empty order',
      };
      next(error);
      return;
    }

    // check no products have a quantity of 0 or less
    let flag = false;
    for (let x = 0; x < payload.items.length; x++) {
      if (parseInt(payload.items.quantity) < 1) {
        flag = true;
        break;
      }
    }
    if (flag) {
      const error = {
        statusCode: 500,
        message: 'Cannot submit an order containing items with a quantity less than 1.',
      };
      next(error);
      return;
    }

    // reach out to API
    const settings = {
      method: 'post',
      url: config.scalapayUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.scalapayToken,
        Accept: 'application/json',
      },
      data: {
        totalAmount: {
          amount: payload.totalAmount.amount,
          currency: payload.totalAmount.currency,
        },
        consumer: {
          phoneNumber: payload.consumer.phoneNumber,
          givenNames: payload.consumer.givenNames,
          surname: payload.consumer.surname,
          email: payload.consumer.email,
        },
        billing: {
          phoneNumber: payload.billing.phoneNumber,
          countryCode: payload.billing.countryCode,
          name: payload.billing.name,
          postcode: payload.billing.postcode,
          suburb: payload.billing.suburb,
          line1: payload.billing.line1,
        },
        shipping: {
          phoneNumber: payload.shipping.phoneNumber,
          countryCode: payload.shipping.countryCode,
          name: payload.shipping.name,
          postcode: payload.shipping.postcode,
          suburb: payload.shipping.suburb,
          line1: payload.shipping.line1,
        },
        items: payload.items,
        discounts: payload.discounts,
        merchant: {
          redirectCancelUrl: payload.merchant.redirectCancelUrl,
          redirectConfirmUrl: payload.merchant.redirectConfirmUrl,
        },
        merchantReference: payload.merchantReference,
        shippingAmount: {
          amount: payload.shippingAmount.amount,
          currency: payload.shippingAmount.currency,
        },
      },
    };

    // get back response from scalapay
    let response = await axios(settings);

    // all good no scalapay errors

    // save shipping, billing and consumer details in DB

    // get user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      const error = {
        statusCode: 500,
        message: 'User not found.',
      };
      next(error);
      return;
    }

    // collect information and save in user record
    // consumer
    user.consumer.phoneNumber = payload.consumer.phoneNumber;
    user.consumer.givenNames = payload.consumer.givenNames;
    user.consumer.surname = payload.consumer.surname;
    user.consumer.email = payload.consumer.email;
    // shipping
    user.shipping.phoneNumber = payload.shipping.phoneNumber;
    user.shipping.countryCode = payload.shipping.countryCode;
    user.shipping.name = payload.shipping.name;
    user.shipping.postcode = payload.shipping.postcode;
    user.shipping.suburb = payload.shipping.suburb;
    user.shipping.line1 = payload.shipping.line1;
    // billing
    user.billing.phoneNumber = payload.billing.phoneNumber;
    user.billing.countryCode = payload.billing.countryCode;
    user.billing.name = payload.billing.name;
    user.billing.postcode = payload.billing.postcode;
    user.billing.suburb = payload.billing.suburb;
    user.billing.line1 = payload.billing.line1;

    // save user
    await user.save();

    // save order in database
    const order = new Order({
      account: userId,
      credentials: {
        token: response.data.token,
        expires: response.data.expires,
        checkoutUrl: response.data.checkoutUrl,
      },
      totalAmount: {
        amount: payload.totalAmount.amount,
        currency: payload.totalAmount.currency,
      },
      consumer: {
        phoneNumber: payload.consumer.phoneNumber,
        givenNames: payload.consumer.givenNames,
        surname: payload.consumer.surname,
        email: payload.consumer.email,
      },
      billing: {
        phoneNumber: payload.billing.phoneNumber,
        countryCode: payload.billing.countryCode,
        name: payload.billing.name,
        postcode: payload.billing.postcode,
        suburb: payload.billing.suburb,
        line1: payload.billing.line1,
      },
      shipping: {
        phoneNumber: payload.shipping.phoneNumber,
        countryCode: payload.shipping.countryCode,
        name: payload.shipping.name,
        postcode: payload.shipping.postcode,
        suburb: payload.shipping.suburb,
        line1: payload.shipping.line1,
      },
      items: payload.items,
      discounts: payload.discounts,
      merchant: {
        redirectConfirmUrl: payload.merchant.redirectConfirmUrl,
        redirectCancelUrl: payload.merchant.redirectCancelUrl,
      },
      merchantReference: payload.merchantReference,
      shippingAmount: {
        amount: payload.shippingAmount.amount,
        currency: payload.shippingAmount.currency,
      },
    });
    await order.save();

    // relay response back to client
    res.status(200).json({
      message: 'Order Complete!',
      receipt: response.data,
    });
  } catch (error) {
    // error occurred
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message =
        'There was a problem with the Scalapay API. Please make sure you have entered valid information.';
    }
    next(error);
  }
};
