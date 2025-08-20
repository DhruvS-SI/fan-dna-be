const funfactsService = require('../services/funfactsService');
const { sql } = require('../storage/db');


async function getFunFacts(req, res, next) {
  try {
    let userId = req.body?.userId;
    let entity
    if(!userId) {
      entity = 'ipl';
    }
    else{
      entity = sql(`select entity_based_data.get_top_entities('${userId}')`);
    }

    // Use only entity1 and entity2 for simplicity
    // if (funfactsService.isAnyEntityKnown(entity1, entity2)) {
    //   const rows = await funfactsService.fetchFunFacts({ entity1, entity2 });
    //   if (Array.isArray(rows) && rows.length > 0 && rows[0]?.fact) {
    //     return res.json({ data: rows[0].fact, source: 'fetched from db' });
    //   }
    // }

    const fact = await funfactsService.generateFunFact({ entity });
    res.json({ data: fact, source: 'generated' });
  } catch (error) {
    next(error);
  }
}


module.exports = { getFunFacts };


