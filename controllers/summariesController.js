const summariesService = require('../services/summariesService');
const axios = require('axios');
// GET /summaries?id=... (or matchID=... for backward-compat)

const MODEL = "google/flan-t5-base"; // use an existing HF model
const AITOKEN = process.env.AITOKEN;

async function getSummaries(req, res, next) {
  try {
    const url = req.query.url;
    const id = req.query.id || req.query.matchID;
    if (!url && !id) {
      return res.status(400).json({ error: 'Missing required query param: url or id' });
    }

    const summaryRaw = await summariesService.fetchSummaries({ id, url });

    const summaryFromAI = await summariesService.generateSummary(summaryRaw);


    res.json({ data: summaryFromAI, TotalScore: summaryRaw.TotalScore, TotalSixes: summaryRaw.TotalSixes, TotalFours: summaryRaw.TotalFours, TotalBoundaryRuns: summaryRaw.TotalBoundaryRuns, HighestBallSpeed: summaryRaw.HighestBallSpeed });
  } catch (error) {
    next(error);
  }
}

module.exports = { getSummaries };


