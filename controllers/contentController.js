const contentService = require('../services/contentService');

// GET /content?type=video
async function getContent(req, res, next) {
  try {
    const { type } = req.query;
    const contentItems = await contentService.fetchContent({ type });
    res.send(contentItems);
  } catch (error) {
    next(error);
  }
}

module.exports = { getContent };




