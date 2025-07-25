const express = require('express');
const router = express.Router();

const tradeController = require('../controllers/trade');

router.post('/portfolio', tradeController.getPortfolio);
router.post('/place-order', tradeController.placeOrder);
router.get('/company-list', tradeController.companyList);
router.post('/buy-sell-instruments', tradeController.buySellInstrument);


module.exports = router;