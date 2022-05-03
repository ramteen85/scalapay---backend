const express = require('express');
const orderController = require('../controllers/order');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

// create order
router.post('/create', isAuth, orderController.createOrder);
// get all orders for a specific user
router.get('/getAll', isAuth, orderController.getAllOrders);
// get order info
router.get('/getOrderInfo', isAuth, orderController.getOrderInfo);

module.exports = router;
