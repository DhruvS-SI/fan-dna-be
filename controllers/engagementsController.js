const engagementsService = require('../services/engagementsService');

// POST /engagements
async function postEngagements(req, res, next) {
  try {
    const { payload, userId } = req.body || {};
    const result = await engagementsService.saveEngagementBatch(payload, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { postEngagements };


