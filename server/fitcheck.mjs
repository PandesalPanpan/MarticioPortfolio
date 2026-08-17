// Fit Check: paste a job description, get a requirement-by-requirement map of
// what Peter can actually evidence and what he cannot.
//
// The trust property this file exists to enforce: the model may only assert a
// strength by citing an id from server/corpus.mjs. Every cited id is verified
// against the corpus here, after generation. A "match" left with no surviving
// citation is demoted to a gap rather than rendered. So the worst a
// hallucinating model can do is understate Peter, never overstate him.

import { EVIDENCE_BY_ID, EVIDENCE_PROMPT, CLAIMED_SKILLS } from './corpus.mjs';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
// The stronger V4 model: Fit Check is extraction under strict rules, and a
// wrong tier is worse here than a slow response. Override to
// `deepseek-v4-flash` to trade some judgement for roughly 6x the speed.
const MODEL = process.env.FITCHECK_MODEL || 'deepseek-v4-pro';

const MAX_JD_CHARS = 6000;
const MIN_JD_CHARS = 40;
// v4-pro is a reasoning model: reasoning_tokens are drawn from this same
// budget and routinely run past 1,300 before a single JSON character appears.
// Too low and the object comes back truncated, which reads as a parse failure.
const MAX_TOKENS = 6000;
const TEMPERATURE = 0.2; // near-deterministic: this is extraction, not prose
const MAX_REQUIREMENTS = 12;

export class FitCheckError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'FitCheckError';
    this.status = status;
  }
}

const SYSTEM_PROMPT = `You are the evidence auditor for Peter Elijah Marticio's developer portfolio. A recruiter has pasted a job description. Your job is to map each requirement to Peter's VERIFIABLE evidence, and to be honest about what is missing.

# Evidence corpus
These are the ONLY facts you may treat as proven. Each line is "id | label | detail".

${EVIDENCE_PROMPT}

# Skills Peter lists but which have no dedicated evidence entry
${CLAIMED_SKILLS.join(', ')}
These may appear ONLY in the "partial" tier, never as a match.

# Your task
1. Extract the distinct technical and professional requirements from the job description. At most ${MAX_REQUIREMENTS}, most important first. Merge near-duplicates.
2. Sort each requirement into exactly one tier:
   - "match": directly supported by one or more corpus entries. MUST cite 1 to 3 ids.
   - "partial": adjacent or self-reported experience, no direct corpus entry. Cite ids only if genuinely related. Say plainly what the shortfall is.
   - "gap": Peter has no evidence for this. Cite nothing. In "note", name the closest real thing he HAS done, or say there is no close analogue.

# Rules that matter more than being helpful
- NEVER invent an evidence id. Only ids listed above exist.
- NEVER upgrade a requirement to "match" because it would look better. A wrong "match" destroys the point of this feature.
- Years of experience, team size, salary, degree completion, and location are NOT things you can evidence. Tier them "partial" or "gap" and say so.
- If the pasted text is not a job description, return {"error":"not_a_jd"} and nothing else.
- "claim" is one sentence, plain and specific, third person ("Peter built...", "He shipped..."). No marketing language. No em dashes.
- Be willing to return more gaps than matches. That is a correct answer, not a failure.

# Output
Return ONLY minified JSON, no markdown fence:
{"role":"<role title from the JD, or empty string>","requirements":[{"requirement":"<short label, max 8 words>","tier":"match|partial|gap","claim":"<one sentence>","evidence":["<id>"],"note":"<shortfall or nearest real thing, else empty>"}]}`;

/** Pull the first JSON object out of a model reply that may be fenced. */
function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : text).trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * The trust boundary. Strips every citation the corpus does not contain, then
 * demotes any "match" that has no citations left.
 */
export function validateResult(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new FitCheckError(502, 'Fit Check could not read the model response.');
  }
  if (parsed.error === 'not_a_jd') {
    throw new FitCheckError(422, 'That does not look like a job description. Paste the role requirements and try again.');
  }
  if (!Array.isArray(parsed.requirements)) {
    throw new FitCheckError(502, 'Fit Check could not read the model response.');
  }

  let droppedCitations = 0;
  const requirements = [];

  for (const item of parsed.requirements.slice(0, MAX_REQUIREMENTS)) {
    if (!item || typeof item.requirement !== 'string') continue;
    const requirement = item.requirement.trim().slice(0, 80);
    if (!requirement) continue;

    const cited = Array.isArray(item.evidence) ? item.evidence : [];
    const evidence = [];
    const seen = new Set();
    for (const id of cited) {
      const entry = EVIDENCE_BY_ID.get(String(id));
      if (!entry) {
        droppedCitations += 1; // model referenced something that does not exist
        continue;
      }
      if (seen.has(entry.id)) continue;
      seen.add(entry.id);
      evidence.push({
        id: entry.id,
        label: entry.label,
        detail: entry.detail,
        href: entry.href ?? null,
      });
    }

    let tier = item.tier === 'match' || item.tier === 'partial' ? item.tier : 'gap';
    // An uncitable strength is not a strength.
    if (tier === 'match' && evidence.length === 0) tier = 'partial';
    if (tier === 'gap') evidence.length = 0;

    requirements.push({
      requirement,
      tier,
      claim: String(item.claim ?? '').trim().slice(0, 240),
      note: String(item.note ?? '').trim().slice(0, 240),
      evidence: evidence.slice(0, 3),
    });
  }

  if (requirements.length === 0) {
    throw new FitCheckError(502, 'Fit Check could not extract any requirements from that text.');
  }

  const counts = { match: 0, partial: 0, gap: 0 };
  for (const r of requirements) counts[r.tier] += 1;

  return {
    role: String(parsed.role ?? '').trim().slice(0, 100),
    requirements,
    counts,
    droppedCitations,
  };
}

/**
 * Run a Fit Check against a pasted job description.
 * @param {{ jd: string, apiKey: string, signal?: AbortSignal }} opts
 */
export async function runFitCheck({ jd, apiKey, signal }) {
  if (!apiKey) {
    throw new FitCheckError(500, 'Server is missing DEEPSEEK_API_KEY.');
  }
  const text = String(jd ?? '').trim();
  if (text.length < MIN_JD_CHARS) {
    throw new FitCheckError(400, 'Paste a bit more of the job description (at least a few lines).');
  }

  const upstream = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Job description:\n\n${text.slice(0, MAX_JD_CHARS)}` },
      ],
    }),
    signal,
  });

  if (!upstream.ok) {
    let detail = '';
    try {
      detail = await upstream.text();
    } catch {
      /* ignore */
    }
    throw new FitCheckError(
      upstream.status === 401 ? 502 : upstream.status || 502,
      `DeepSeek request failed (${upstream.status}). ${detail.slice(0, 300)}`,
    );
  }

  const payload = await upstream.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new FitCheckError(502, 'Fit Check got an empty response.');
  }

  const parsed = extractJson(content);
  if (!parsed) {
    // Log the shape server-side; the client only ever sees a generic message.
    console.error(
      `[fit-check] unparseable reply (finish_reason=${payload?.choices?.[0]?.finish_reason}, ` +
        `completion_tokens=${payload?.usage?.completion_tokens}): ${content.slice(0, 400)}`,
    );
  }
  return validateResult(parsed);
}
