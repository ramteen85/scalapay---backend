const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    shipping: {
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
    consumer: {
      phoneNumber: {
        type: String,
      },
      givenNames: {
        type: String,
      },
      surname: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
