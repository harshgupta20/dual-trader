const express = require('express');
const router = express.Router();

const dataController = require('../controllers/data');

router.post('/instruments-ltp', dataController.getLTP);


module.exports = router;