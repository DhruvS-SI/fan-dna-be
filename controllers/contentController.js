const contentService = require('../services/contentService');

// GET /content?type=video
async function getContent(req, res, next) {
  try {
    const { type } = req.query;
    const userIdFromPayload = req.body?.userId;
    const userId = typeof userIdFromPayload === 'string' && userIdFromPayload.trim().length > 0
      ? userIdFromPayload.trim()
      : req.cookies.userId; // fall back to cookie

    let contentItems = [];
    if(userId && userId.length > 0) {
      contentItems = await contentService.fetchPersonalisedContent({ type, userId });
      res.send(contentItems);
    } else {
      contentItems = await contentService.fetchContent({ type });
      res.send(contentItems?.[0]?.get_content);
    }


    
  } catch (error) {
    next(error);
  }
}

module.exports = { getContent };




