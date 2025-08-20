// POST /login
async function postLogin(req, res, next) {
  try {
    const { userId, maxAgeMs } = req.body || {};
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      return res.status(400).json({ error: 'Missing or invalid userId' });
    }

    

    const id = String(Math.floor(1000 + Math.random() * 9000));
    res.json({ ok: true, userId: id });
  } catch (error) {
    next(error);
  }
}

module.exports = { postLogin };



