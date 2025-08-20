const express = require('express');
const { postEngagements } = require('../controllers/engagementsController');

const router = express.Router();

// POST /engagements
router.post('/', postEngagements);

module.exports = router;


