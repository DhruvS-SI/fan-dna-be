const express = require('express');
const { postLogin } = require('../controllers/loginController');

const router = express.Router();

// POST /login
router.post('/', postLogin);

module.exports = router;



