const express = require('express');
const { getFixtures } = require('../controllers/fixturesController');

const router = express.Router();

// GET /fixtures
router.get('/', getFixtures);

module.exports = router;



