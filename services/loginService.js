const { sql } = require('../storage/db');

/**
 * Calls the Postgres function entity_based_data.login_user_simple(userId, password)
 * and returns its result.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.password
 * @returns {Promise<any>} The result returned by the DB function
 */
async function loginUserSimple({ userId, password }) {
  if (!userId || !password) {
    const error = new Error('Missing required fields: userId and password');
    error.status = 400;
    throw error;
  }
  const query = `select entity_based_data.insert_or_login_user('${userId}') as result`;
  console.log('query', query);
  const rows = await sql(query);


  // Return the function result if aliased, else first row
  return rows && rows[0] && (rows[0].result ?? rows[0]);
}

module.exports = { loginUserSimple };


