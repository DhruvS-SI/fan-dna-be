const express = require('express');
const { getSummaries } = require('../controllers/summariesController');

const router = express.Router();

// GET /summaries?matchID=...
router.get('/', getSummaries);

module.exports = router;


