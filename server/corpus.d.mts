// Type declarations for the plain-JS evidence corpus, consumed by
// vite.config.ts and tests/fitcheck.test.ts.

export type EvidenceKind = 'project' | 'role' | 'cert';

export type Evidence = {
  id: string;
  kind: EvidenceKind;
  label: string;
  detail: string;
  href?: string;
  /** Matching id in src/data, cross-checked by tests/fitcheck.test.ts. */
  ref?: string;
};

export const EVIDENCE: Evidence[];
export const EVIDENCE_BY_ID: Map<string, Evidence>;
export const EVIDENCE_PROMPT: string;
export const CLAIMED_SKILLS: string[];
