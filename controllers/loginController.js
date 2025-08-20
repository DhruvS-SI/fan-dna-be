// POST /login
async function postLogin(req, res, next) {
  try {
    const { userId, maxAgeMs } = req.body || {};
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      return res.status(400).json({ error: 'Missing or invalid userId' });
    }

    const isProd = (process.env.NODE_ENV === 'production') || (process.env.VERCEL === '1');
    const cookieMaxAge = Number(maxAgeMs) && Number(maxAgeMs) > 0 ? Number(maxAgeMs) : 30 * 24 * 60 * 60 * 1000; // 30 days

    res.cookie('userId', userId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: cookieMaxAge,
      path: '/',
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { postLogin };



