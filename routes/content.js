const express = require('express');
const { getContent } = require('../controllers/contentController');

const router = express.Router();

// GET /content?type=video
router.get('/', getContent);

module.exports = router;


