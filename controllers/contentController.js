const contentService = require('../services/contentService');

// GET /content?type=video
async function getContent(req, res, next) {
  try {
    const { type } = req.query;
    const userId = req.cookies.userId; // get cookie
    console.log("userId", userId);

    let contentItems = [];
    if(userId) {
      contentItems = await contentService.fetchContent({ type });
      res.send(contentItems?.[0]?.get_content);
    } else {
      contentItems = await contentService.fetchPersonalisedContent({ type, userId });
      res.send(contentItems,);
    }


    
  } catch (error) {
    next(error);
  }
}

module.exports = { getContent };




