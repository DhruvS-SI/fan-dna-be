const { sql } = require('../storage/db');

async function fetchContent({ type }) {
  // Call the stored function in schema entity_based_data
  // Assumes signature entity_based_data.get_content(type TEXT)
  return sql('SELECT * FROM entity_based_data.get_content(null)');

}


async function fetchPersonalisedContent({ type, userId  }) {
  // Expand composite rows into JSON objects directly from SQL
  let query = `select entity_based_data.get_personalized_feed_fixed_1('${userId}')`;
  // const query = `
  //   SELECT to_jsonb(t) AS item
  //   FROM entity_based_data.get_personalized_feed_fixed_1($1::text, 10) AS t
  // `;

  const rows = await sql(query);

  const result = rows?.[0]?.get_personalized_feed_fixed_1;
  // Flatten values from all keys into a single array
  if (result && typeof result === 'object' && !Array.isArray(result)) {
    const merged = Object.values(result).reduce((acc, value) => {
      if (Array.isArray(value)) {
        acc.push(...value);
      } else if (value !== null && value !== undefined) {
        acc.push(value);
      }
      return acc;
    }, []);
    return merged;
  }
  if (Array.isArray(result)) return result;

  if (result === null || result === undefined) return [];
  return [result];  
}

module.exports = { fetchContent, fetchPersonalisedContent };


