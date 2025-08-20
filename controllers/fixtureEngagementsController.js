const fixtureEngagementsService = require('../services/fixtureEngagementsService');

// POST /fixtures/engagements
async function postFixtureEngagements(req, res, next) {
  try {
    const { payload, userId } = req.body || {};
    const result = await fixtureEngagementsService.saveFixtureEngagements(payload, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { postFixtureEngagements };





