const { sql } = require('../storage/db');

async function saveEngagementBatch(payload, userId) {
  // Expect payload to be an array of objects, pass through as JSONB to the SP
  if (!Array.isArray(payload)) {
    throw new Error('Payload must be an array of engagements');
  }

  // Validate: ensure each item has content_id
  for (const item of payload) {
    if (!item || item.content_id === undefined || item.content_id === null) {
      throw new Error('Each item must include content_id');
    }
  }

  if (payload.length > 0) {
    await sql(
      'SELECT entity_based_data.update_user_affinity($1::varchar, $2::jsonb)',
      [String(userId), JSON.stringify(payload)]
    );
  }

  // Return original payload as requested
  return payload;
}

module.exports = { saveEngagementBatch };