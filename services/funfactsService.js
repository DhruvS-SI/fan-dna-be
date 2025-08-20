const { sql } = require('../storage/db');
const { knownEntities } = require('../storage/knownEntities');
const AITOKEN = process.env.AITOKEN;

// Maintain a simple in-memory set of known entities from one place
const knownEntitiesSet = new Set(
  Array.isArray(knownEntities)
    ? knownEntities.map((n) => String(n).toLowerCase().trim()).filter(Boolean)
    : []
);

function isAnyEntityKnown(entity1, entity2) {
  const e1 = entity1 ? String(entity1).toLowerCase() : '';
  const e2 = entity2 ? String(entity2).toLowerCase() : '';
  return (e1 && knownEntitiesSet.has(e1)) || (e2 && knownEntitiesSet.has(e2));
}

async function fetchFunFacts({ entity1, entity2 }) {
  const rows = await sql(
    'SELECT fact FROM funfacts WHERE (entity1 = $1 AND entity2 = $2) OR (entity1 = $2 AND entity2 = $1) ORDER BY created_at DESC LIMIT 50',
    [entity1, entity2]
  );
  // If none found, you can later add external fetch logic here
  return rows;
}

async function generateFunFact({ entity1, entity2, entities }) {
  const entitiesString = entities
    ? String(entities)
    : [entity1, entity2].filter(Boolean).join(' and ');

  if (!entitiesString) {
    const err = new Error('Missing required entities to generate fun fact');
    err.status = 400;
    throw err;
  }

  const prompt = `Give me one short, interesting, verifiable cricket related fun fact about ${entitiesString}. Keep it to one sentence it should have catchy words.`;

  const body = JSON.stringify({
    model: 'openai/gpt-oss-20b:fireworks-ai',
    messages: [{ role: 'user', content: prompt }],
  });

  const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AITOKEN}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  const json = await res.json();
  const raw = json?.choices?.[0]?.message?.content ?? '';
  return String(raw)
    .replace(/\\n/g, ' ')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/^"|"$/g, '');
}

module.exports = { fetchFunFacts, generateFunFact };
module.exports.isAnyEntityKnown = isAnyEntityKnown;


