const { transaction } = require('../storage/db');

async function saveEngagementBatch(payload, cookieUserId) {
  // Expect batches of N; insert in a single transaction
  if (!Array.isArray(payload)) {
    throw new Error('Payload must be an array of engagements');
  }

  const insertedRows = await transaction(async (client) => {
    const values = [];
    const params = [];
    let paramIndex = 1;
    for (const item of payload) {
      const { contentId, action } = item;
      const userId = cookieUserId;
      if (!userId || !contentId || !action) {
        throw new Error('Each engagement must include contentId and action; userId is taken from cookie');
      }
      // ($userId, $contentId, $action, COALESCE($ts, NOW()))
      values.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, COALESCE($${paramIndex + 3}, NOW()))`);
      params.push(userId, contentId, action);
      paramIndex += 4;
    }
    if (values.length === 0) return [];
    const query = `
      INSERT INTO engagements (user_id, content_id, action)
      VALUES ${values.join(', ')}
      RETURNING *
    `;
    const { rows } = await client.query(query, params);
    return rows;
  });

  return insertedRows;
}

module.exports = { saveEngagementBatch };


