const express = require('express');
const { getUserDNA } = require('../controllers/userDNAController');

const router = express.Router();

// GET /userDNA
router.get('/', getUserDNA);

module.exports = router;


