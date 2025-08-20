const { sql } = require('../storage/db');

async function fetchContent({ type }) {
  // Simple example: filter by type if provided, otherwise return random sample
  if (type) {
    return sql('SELECT * FROM content WHERE type = $1 ORDER BY created_at DESC LIMIT 50', [type]);
  }
  return sql('SELECT * FROM content ORDER BY random() LIMIT 50');
}

module.exports = { fetchContent };


