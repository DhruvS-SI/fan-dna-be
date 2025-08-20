const fixturesService = require('../services/fixturesService');

// GET /fixtures
async function getFixtures(req, res, next) {
  try {
    const { type } = req.query;
    const userId = req.cookies.userId;

    let items = [];
    if (!userId) {
      items = await fixturesService.fetchFixtures({ type });
      res.json(items);
    } else {
      items = await fixturesService.fetchPersonalisedFixtures({ type, userId });
      res.json(items);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { getFixtures };



