const engagementsService = require('../services/engagementsService');

// POST /engagements
async function postEngagements(req, res, next) {
  try {
    const payload = req.body;
    const result = await engagementsService.saveEngagementBatch(payload);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { postEngagements };


