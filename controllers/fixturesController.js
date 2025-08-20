const fixturesService = require('../services/fixturesService');

// GET /fixtures
async function getFixtures(req, res, next) {
  try {
    const { type } = req.query;
    const userIdFromPayload = req.body?.userId;
    const userId = typeof userIdFromPayload === 'string' && userIdFromPayload.trim().length > 0
      ? userIdFromPayload.trim()
      : req.cookies.userId;

    let items = [];

    if (userId && userId.length > 0) {
      items = await fixturesService.fetchPersonalisedFixtures({ type, userId, limit: 10 });
      return res.json(items[0]?.get_personalized_fixture_1?.matches);
    } else {
      items = await fixturesService.fetchFixtures({ type });
      return res.json(items[0]?.get_fixture_listing);
    }
    // res.json(items);
  } catch (error) {
    next(error);
  }
}

module.exports = { getFixtures };



