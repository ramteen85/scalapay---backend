const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    credentials: {
      token: {
        type: String,
        required: true,
      },
      expires: {
        type: String,
        required: true,
      },
      checkoutUrl: {
        type: String,
        required: true,
      },
    },
    totalAmount: {
      amount: {
        type: String,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
    },
    consumer: {
      phoneNumber: {
        type: String,
      },
      givenNames: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    billing: {
      phoneNumber: {
        type: String,
      },
      countryCode: {
        type: String,
      },
      name: {
        type: String,
      },
      postcode: {
        type: String,
      },
      suburb: {
        type: String,
      },
      line1: {
        type: String,
      },
    },
    shipping: {
      phoneNumber: {
        type: String,
      },
      countryCode: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      postcode: {
        type: String,
        required: true,
      },
      Suburb: {
        type: String,
      },
      line1: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        gtin: {
          type: String,
        },
        // convert back to int server side if string doesnt work!
        quantity: {
          //   type: Number,
          type: String,
          required: true,
        },
        price: {
          amount: {
            type: String,
            required: true,
          },
          currency: {
            type: String,
            required: true,
          },
        },
        name: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        subcategory: [
          {
            type: String,
          },
        ],
        sku: {
          type: String,
          required: true,
        },
        brand: {
          type: String,
        },
      },
    ],
    discounts: [
      {
        amount: {
          type: String,
        },
        displayName: {
          type: String,
        },
      },
    ],
    merchant: {
      redirectConfirmUrl: {
        type: String,
      },
      redirectCancelUrl: {
        type: String,
      },
    },
    merchantReference: {
      type: String,
    },
    shippingAmount: {
      amount: {
        type: String,
      },
      currency: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
