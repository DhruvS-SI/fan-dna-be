const funfactsService = require('../services/funfactsService');

// GET /funfacts?entity1=...&entity2=...
async function getFunFacts(req, res, next) {
  try {
    const { entity1, entity2 } = req.query;
    // Use only entity1 and entity2 for simplicity
    if (funfactsService.isAnyEntityKnown(entity1, entity2)) {
      const rows = await funfactsService.fetchFunFacts({ entity1, entity2 });
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.fact) {
        return res.json({ data: rows[0].fact, source: 'fetched from db' });
      }
    }

    const fact = await funfactsService.generateFunFact({ entity1, entity2 });
    res.json({ data: fact, source: 'generated' });
  } catch (error) {
    next(error);
  }
}


module.exports = { getFunFacts };


