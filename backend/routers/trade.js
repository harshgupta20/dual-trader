const express = require('express');
const router = express.Router();

const tradeController = require('../controllers/trade');

router.post('/portfolio', tradeController.getPortfolio);
router.post('/place-order', tradeController.placeOrder);


module.exports = router;