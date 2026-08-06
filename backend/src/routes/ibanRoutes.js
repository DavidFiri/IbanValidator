const express = require('express');
const router = express.Router();

const {postIban} = require('../controllers/ibanController');

router.post('/', postIban);
//router.post('/batch', postIbans);

module.exports = router;