const { sql } = require('../storage/db');

async function fetchUserDNA({ userId }) {
  if (!userId) {
    return null;
  }
  const rows = await sql('SELECT * FROM user_dna WHERE user_id = $1', [userId]);
  return rows[0] || null;
}

module.exports = { fetchUserDNA };


