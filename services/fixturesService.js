const { sql } = require('../storage/db');

async function fetchFixtures({ type }) {
  console.log('fetchFixtures');
  const rows = await sql(`SELECT entity_based_data.get_fixture_listing(10)`);
  console.log('rows', rows);
  return rows;
}

async function fetchPersonalisedFixtures({ type, userId , limit  }) {
  console.log('fetchPersonalisedFixtures', type, userId, limit);
  let query =  `select * from entity_based_data.get_personalized_fixture_1('${userId}', ${limit})`;
  const rows = await sql(query);
  return rows;
}

module.exports = { fetchFixtures, fetchPersonalisedFixtures };



