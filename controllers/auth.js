const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // check user exists
    let user = await User.findOne({ email: email });
    if (!user) {
      // user does not exist
      const error = {
        statusCode: 401,
        message: 'Invalid Credentials.',
      };
      next(error);
      // don't continue
      return;
    }
    // user exists

    // check the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // wrong password
      const error = {
        statusCode: 401,
        message: 'Invalid Credentials.',
      };
      next(error);
      // don't continue
      return;
    }
    // passwords match!

    // create token
    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        userId: user._id.toString(),
      },
      config.AUTHKEY,
      { expiresIn: config.expiresIn + 's' },
    );

    res.status(200).json({
      message: 'Login Successful!',
      userId: user._id.toString(),
      token,
      expiresIn: config.expiresIn,
    });
  } catch (error) {
    // error occurred
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const email = req.body.email; // required
    const password = req.body.password; // required and should be minimum 6 characters
    const hashedPassword = await bcrypt.hash(password, 12); // hash the password
    const pattern =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    // server side validation

    // check if user exists
    let user = await User.findOne({ email: email });
    if (user) {
      const error = {
        statusCode: 401,
        message: 'User already registered.',
      };
      next(error);
    }

    // check if valid email
    if (!email || email.length === 0) {
      const error = {
        statusCode: 401,
        message: 'Please enter an email.',
      };
      next(error);
    }

    if (!email.toLowerCase().match(pattern)) {
      const error = {
        statusCode: 401,
        message: 'Please enter a valid email.',
      };
      next(error);
    }

    // check if password is empty
    if (!password || password.length === 0) {
      const error = {
        statusCode: 401,
        message: 'Please enter a password.',
      };
      next(error);
    }

    // server side validation passed! register account

    // initialise user
    user = new User({
      email,
      password: hashedPassword,
      shipping: {},
      billing: {},
      consumer: {},
    });

    await user.save();

    // generate token
    const token = jwt.sign(
      {
        email,
        userId: user._id.toString(),
      },
      config.AUTHKEY,
      { expiresIn: config.expiresIn + 's' },
    );
    // return successful response
    res.status(201).json({
      message: 'User Registered!',
      userId: user._id,
      token,
      expiresIn: config.expiresIn,
    });
  } catch (error) {
    // error occurred
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
