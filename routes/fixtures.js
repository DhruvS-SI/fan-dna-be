const express = require('express');
const { getFixtures } = require('../controllers/fixturesController');
const { postFixtureEngagements } = require('../controllers/fixtureEngagementsController');

const router = express.Router();

// GET /fixtures
router.get('/', getFixtures);

// POST /fixtures/engagements
router.post('/engagements', postFixtureEngagements);

module.exports = router;



