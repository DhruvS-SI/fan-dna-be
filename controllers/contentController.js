const contentService = require('../services/contentService');

// GET /content?type=video&userId=123
async function getContent(req, res, next) {
  try {
    const { type } = req.query;
    const userIdFromQuery = req.query.userId ?? req.query.userid ?? req.query.user_id ?? req.query.uid;
    const userIdFromPayload = req.body?.userId;
    const userIdFromCookie = req.cookies?.userId;


    const normalize = (val) =>
      typeof val === 'string' ? val.trim() : (val != null ? String(val).trim() : '');

    const userId = [userIdFromQuery, userIdFromPayload, userIdFromCookie]
      .map(normalize)
      .find((id) => id.length > 0); 

    let contentItems = [];
    if(userId && userId.length > 0) {
      contentItems = await contentService.fetchPersonalisedContent({ type, userId });
      res.send(contentItems);
    } else {
      // return res.send([]);
      contentItems = await contentService.fetchContent({ type });
      res.send(contentItems?.[0]?.get_content);
    }


    
  } catch (error) {
    next(error);
  }
}

module.exports = { getContent };




