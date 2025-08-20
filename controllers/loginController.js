const { loginUserSimple } = require('../services/loginService');

// POST /login
async function postLogin(req, res, next) {
  try {
    const { userId, password } = req.body || {};
    const result = await loginUserSimple({ userId, password });
    res.json({ ok: true, userId: userId });
  } catch (error) {
    next(error);
  }
}

module.exports = { postLogin }; 



