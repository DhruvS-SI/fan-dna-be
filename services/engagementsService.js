const { transaction } = require('../storage/db');

async function saveEngagementBatch(payload) {
  // Expect batches of N; insert in a single transaction
  if (!Array.isArray(payload)) {
    throw new Error('Payload must be an array of engagements');
  }

  const inserted = await transaction(async (client) => {
    let count = 0;
    for (const item of payload) {
      const { userId, contentId, action, ts } = item;
      await client.query(
        'INSERT INTO engagements (user_id, content_id, action, ts) VALUES ($1, $2, $3, COALESCE($4, NOW()))',
        [userId, contentId, action, ts]
      );
      count += 1;
    }
    return count;
  });

  return { inserted };
}

module.exports = { saveEngagementBatch };


