// POST /login
async function postLogin(req, res, next) {
  try {
    const { maxAgeMs } = req.body || {};
 

    

    const id = String(Math.floor(1000 + Math.random() * 9000));
    res.json({ ok: true, userId: id });
  } catch (error) {
    next(error);
  }
}

module.exports = { postLogin };



