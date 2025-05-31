const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/profile', userController.getProfile);


module.exports = router;