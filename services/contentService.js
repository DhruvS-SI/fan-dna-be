const { sql } = require('../storage/db');

async function fetchContent({ type }) {
  // Call the stored function in schema entity_based_data
  // Assumes signature entity_based_data.get_content(type TEXT)
  return sql('SELECT * FROM entity_based_data.get_content(null)');
}

module.exports = { fetchContent };


