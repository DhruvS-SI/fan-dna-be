const { sql } = require('../storage/db');

async function saveFixtureEngagements(payload, userId) {
  if (!Array.isArray(payload)) {
    throw new Error('Payload must be an array of fixture engagements');
  }

  // Validate: each item must include fixture_id and action
  for (const item of payload) {
    if (!item || item.match_id === undefined || item.match_id === null) {
      throw new Error('Each item must include match_id');
    }
    if (!item.action) {
      throw new Error('Each item must include action');
    }
  }

  if (payload.length > 0) {
    let query = `select entity_based_data.update_user_affinity_from_fixtures(
'${userId}', 
'${JSON.stringify(payload)}')`;
    const rows = await sql(query); 
  
  }

  return payload;
}

module.exports = { saveFixtureEngagements };





