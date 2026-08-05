const express = require('express');
const router = express.Router();

const {postIban} = require('../controllers/ibanController');

router.post('/', postIban);


module.exports = router;