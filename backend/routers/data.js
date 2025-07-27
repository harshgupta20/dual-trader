const express = require('express');
const router = express.Router();

const dataController = require('../controllers/data');

router.post('/instruments-ltp', dataController.getLTP);
router.post("/update-intruments-future-list", dataController.setInstrumentsFuturesLocally);
router.post("/instruments-list", dataController.getInstrumentsList);


module.exports = router;