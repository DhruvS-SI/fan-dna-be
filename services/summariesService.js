const https = require('https');
const http = require('http');

const summariesBaseUrl = process.env.SUMMARIES_BASE_URL || '';
const summariesPathPrefix = process.env.SUMMARIES_PATH_PREFIX || 'summaries/';
const summariesFileSuffix = process.env.SUMMARIES_FILE_SUFFIX || '.json';
const AITOKEN = process.env.AITOKEN;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      const { statusCode } = res;
      if (statusCode && statusCode >= 400) {
        const err = new Error(`Request failed with status ${statusCode}`);
        err.status = statusCode;
        res.resume();
        reject(err);
        return;
      }
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function extractEvents(raw) {
  const list = raw.Commentary
 

  return list.map((item) => {
    return {
      Over: item.Over ?? null,
      Ball_Number: item.Ball_Number ?? item.ball_number ?? item.ballNumber ?? null,
      Over_No: item.Over_No ?? item.over_no ?? item.overNo ?? null,
      Ball: item.Ball ?? item.ball ?? (item.Over ? String(item.Over).split('.')[1] ?? null : null),
      Runs: item.Runs ?? item.runs ?? null,
      Wickets: item.Wickets ?? item.wickets ?? null,
      Score: item.Score ?? item.score ?? item.total ?? null,
      Bowler_Name: item.Bowler_Name ?? item.bowler_name ?? item.bowler ?? item.Bowler ?? null,
      Batsman_Name: item.Batsman_Name ?? item.batsman_name ?? item.batter_name ?? item.batsman ?? null,
      Non_Striker_Name: item.Non_Striker_Name ?? item.non_striker_name ?? item.nonStriker ?? item.non_striker ?? null,
    };
  });
}

function extractMeta(raw) {
  return {
    InningNo: raw?.InningNo ?? null,
    BattingTeam_Id: raw?.BattingTeam_Id ?? null,
    BattingTeam: raw?.BattingTeam ?? null,
    BowlingTeam_Id: raw?.BowlingTeam_Id ?? null,
    BowlingTeam: raw?.BowlingTeam ?? null,
    GameCode: raw?.GameCode ?? null,
    MatchId: raw?.MatchId ?? null,
    Timestamp: raw?.Timestamp ?? null,
    Deleted_UID: Array.isArray(raw?.Deleted_UID) ? raw.Deleted_UID : [],
    Equation: raw?.Equation ?? null,
    Series_Status: raw?.Series_Status ?? null,
  };
}

function overToFloat(overStr) {
  if (overStr === undefined || overStr === null) return -Infinity;
  const parts = String(overStr).split('.');
  const over = Number(parts[0]);
  const ball = parts.length > 1 ? Number(parts[1]) : 0;
  if (!Number.isFinite(over)) return -Infinity;
  const clampedBall = Number.isFinite(ball) ? Math.min(Math.max(ball, 0), 6) : 0;
  return over + clampedBall / 6;
}

function formatOverForDisplay(overStr) {
  if (overStr === undefined || overStr === null) return null;
  const parts = String(overStr).split('.');
  const over = Number(parts[0]);
  const ball = parts.length > 1 ? Number(parts[1]) : null;
  if (!Number.isFinite(over)) return String(overStr);
  if (Number.isFinite(ball)) {
    if (ball >= 6) return String(over + 1);
    if (ball === 0) return String(over);
    return `${over}.${ball}`;
  }
  return String(over);
}

async function fetchSummaries({ id, url }) {
  const targetUrl = url || (summariesBaseUrl ? `${summariesBaseUrl.replace(/\/$/, '')}/${summariesPathPrefix}${id}${summariesFileSuffix}` : 'https://www.punjabkingsipl.in/cricket/live/json/bckp06032025260875_commentary_all_2.json');
  const raw = await fetchJson(targetUrl);
  const events = extractEvents(raw);
  const meta = extractMeta(raw);
  let totalScore = null;
  if (Array.isArray(events) && events.length > 0) {
    const latest = events.reduce((acc, ev) => {
      const val = overToFloat(ev.Over);
      if (val > acc.max) return { max: val, score: ev.Score ?? acc.score, over: ev.Over ?? acc.over };
      return acc;
    }, { max: -Infinity, score: null, over: null });
    const overDisplay = formatOverForDisplay(latest.over);
    totalScore = latest.score ? `${latest.score}${overDisplay ? ` (${overDisplay})` : ''}` : null;
  }
  console.log("totalScore", totalScore);
  return { ...meta, TotalScore: totalScore, Commentary: events };
}

async function generateSummary(payload) {
  const prompt = `You are a cricket commentator. Write ONLY a short, classic, catchy summary of the inning in 5-6 lines.
  - Mention team names if present.
  - Do NOT give ball-by-ball details.
  - Use ONLY the data from the input JSON.
  - Do NOT add or assume any extra information.
  JSON DATA: ${JSON.stringify(payload)}`;

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

module.exports = { fetchSummaries, generateSummary };


