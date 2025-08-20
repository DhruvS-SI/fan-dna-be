const express = require('express');
const { getFunFacts } = require('../controllers/funfactsController');

const router = express.Router();

// GET /funfacts?entity1=virat&entity2=rcb
router.get('/', getFunFacts);

module.exports = router;


