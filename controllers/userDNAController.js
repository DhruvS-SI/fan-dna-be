const userDNAService = require('../services/userDNAService');

// GET /userDNA
async function getUserDNA(req, res, next) {
  try {
    const userId = req.user?.id || null; // placeholder for auth
    const dna = await userDNAService.fetchUserDNA({ userId });
    res.json({ data: dna });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUserDNA };


