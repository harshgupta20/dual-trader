const express = require('express');
const router = express.Router();

const tradeController = require('../controllers/trade');

router.post('/profile', tradeController.getPortfolio);


module.exports = router;