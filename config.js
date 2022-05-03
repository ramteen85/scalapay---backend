// this file should be git ignored when it is time for deployment

module.exports.PORT = 8000; // server port
module.exports.baseUrl = 'localhost'; // server URL
module.exports.MONGOPORT = 27017; // mongodb port (default 27017)
module.exports.AUTHKEY = '[somesupersecretlongpassword]'; // your token key
// no user and pass set on my local DB
module.exports.dbUser = ''; // mongo database user
module.exports.dbPass = ''; // mongo database password
module.exports.expiresIn = 21600; // token expiry
// cors permissions (request headers)
module.exports.cors = {
  allowOrigin: '*',
  allowMethods: 'GET, POST',
  allowHeaders: 'Content-Type, Authorization',
};
// scalapay credentials
module.exports.scalapayUrl = 'https://integration.api.scalapay.com/v2/orders';
module.exports.scalapayToken = 'Bearer qhtfs87hjnc12kkos';
