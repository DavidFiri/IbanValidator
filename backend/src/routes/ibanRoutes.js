const express = require('express');
const router = express.Router();

const {postIban, postIbans} = require('../controllers/ibanController');

router.post('/', postIban);
router.post('/batch', postIbans);

module.exports = router;