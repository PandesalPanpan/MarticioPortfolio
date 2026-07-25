import { describe, it, expect } from 'vitest';
import { EVIDENCE, EVIDENCE_BY_ID } from '../server/corpus.mjs';
import { validateResult, FitCheckError } from '../server/fitcheck.mjs';
import { projects } from '../src/data/projects';
import { experience } from '../src/data/experience';
import { certifications } from '../src/data/certifications';
import { education } from '../src/data/education';

describe('evidence corpus', () => {
  it('has unique ids', () => {
    const ids = EVIDENCE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // server/corpus.mjs restates facts that also live in src/data. This is the
  // guard against the two copies drifting apart.
  it('only references entities that exist in src/data', () => {
    const known = new Set([
      ...projects.map((p) => p.id),
      ...experience.map((e) => e.id),
      ...certifications.map((c) => c.id),
      ...education.map((e) => e.id),
    ]);
    const orphans = EVIDENCE.filter((e) => e.ref && !known.has(e.ref)).map((e) => e.id);
    expect(orphans).toEqual([]);
  });

  it('gives every entry a label and a detail', () => {
    for (const e of EVIDENCE) {
      expect(e.label.length, e.id).toBeGreaterThan(0);
      expect(e.detail.length, e.id).toBeGreaterThan(0);
    }
  });
});

describe('validateResult citation filter', () => {
  const realId = EVIDENCE[0].id;

  it('keeps a match backed by a real citation', () => {
    const out = validateResult({
      role: 'Frontend Engineer',
      requirements: [
        { requirement: 'React', tier: 'match', claim: 'He built X.', evidence: [realId], note: '' },
      ],
    });
    expect(out.requirements[0].tier).toBe('match');
    expect(out.requirements[0].evidence[0].id).toBe(realId);
    expect(out.counts.match).toBe(1);
  });

  it('drops invented evidence ids and demotes the uncitable match', () => {
    const out = validateResult({
      role: '',
      requirements: [
        {
          requirement: 'Kubernetes at scale',
          tier: 'match',
          claim: 'He ran production clusters.',
          evidence: ['peter.kubernetes.wizard'],
          note: '',
        },
      ],
    });
    expect(out.requirements[0].tier).toBe('partial'); // cannot stay a "match"
    expect(out.requirements[0].evidence).toEqual([]);
    expect(out.droppedCitations).toBe(1);
    expect(out.counts.match).toBe(0);
  });

  it('strips citations attached to a gap', () => {
    const out = validateResult({
      requirements: [
        { requirement: 'Rust', tier: 'gap', claim: '', evidence: [realId], note: 'No Rust work.' },
      ],
    });
    expect(out.requirements[0].evidence).toEqual([]);
    expect(out.counts.gap).toBe(1);
  });

  it('treats an unknown tier as a gap', () => {
    const out = validateResult({
      requirements: [
        { requirement: 'Vibes', tier: 'excellent', claim: '', evidence: [realId], note: '' },
      ],
    });
    expect(out.requirements[0].tier).toBe('gap');
  });

  it('de-duplicates repeated citations', () => {
    const out = validateResult({
      requirements: [
        { requirement: 'React', tier: 'match', claim: '', evidence: [realId, realId], note: '' },
      ],
    });
    expect(out.requirements[0].evidence).toHaveLength(1);
  });

  it('rejects a non-job-description signal', () => {
    expect(() => validateResult({ error: 'not_a_jd' })).toThrow(FitCheckError);
  });

  it('rejects a malformed response', () => {
    expect(() => validateResult(null)).toThrow(FitCheckError);
    expect(() => validateResult({ requirements: [] })).toThrow(FitCheckError);
  });

  it('exposes every surviving citation from the corpus', () => {
    const out = validateResult({
      requirements: EVIDENCE.slice(0, 5).map((e) => ({
        requirement: e.id,
        tier: 'match',
        claim: '',
        evidence: [e.id],
        note: '',
      })),
    });
    for (const r of out.requirements) {
      expect(EVIDENCE_BY_ID.has(r.evidence[0].id)).toBe(true);
    }
  });
});
