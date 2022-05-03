const config = require('./config');
const express = require('express');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// CORS
app.use(
  cors({
    allowedHeaders: `${config.cors.allowHeaders}`,
    origin: `${config.cors.allowOrigin}`,
    methods: `${config.cors.allowMethods}`,
  }),
);

// create server
const server = require('http').createServer(app);

// parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // application/json

// routes
app.use('/auth', authRoutes); // login and register
app.use('/order', orderRoutes); // orders

// error handling
app.use(async (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  const retErr = {
    error: true,
    statusCode: status,
    message: message,
    data: data,
  };
  next(retErr);
  res.status(status).json(retErr);
});

// DB Connection
mongoose.Promise = global.Promise;
let url;
if (config.dbUser !== '' && config.dbPass !== '' && config.baseUrl !== '') {
  url = `mongodb://${config.dbUser}:${config.dbpass}@${config.baseUrl}:${config.MONGOPORT}/scalapay`;
} else {
  url = 'mongodb://localhost:27017/scalapay';
}
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.listen(config.PORT, config.baseUrl, () => {
  console.log('Server Up!');
});
