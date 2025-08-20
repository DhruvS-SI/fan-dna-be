const { sql } = require('../storage/db');

async function fetchContent({ type }) {
  // Call the stored function in schema entity_based_data
  // Assumes signature entity_based_data.get_content(type TEXT)
  return sql('SELECT * FROM entity_based_data.get_content(null)');

}


async function fetchPersonalisedContent({ type, userId = '1234' }) {
  // Expand composite rows into JSON objects directly from SQL
  const query = `
    SELECT to_jsonb(t) AS item
    FROM entity_based_data.get_personalized_feed($1::text, 10) AS t
  `;
  const rows = await sql(query, [userId]);
  return rows.map(r => r.item);
}

module.exports = { fetchContent, fetchPersonalisedContent };


