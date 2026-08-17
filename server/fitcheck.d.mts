// Type declarations for the plain-JS Fit Check engine, consumed by
// vite.config.ts and tests/fitcheck.test.ts.

export class FitCheckError extends Error {
  status: number;
  constructor(status: number, message: string);
}

export type Tier = 'match' | 'partial' | 'gap';

export type CitedEvidence = {
  id: string;
  label: string;
  detail: string;
  href: string | null;
};

export type ValidatedRequirement = {
  requirement: string;
  tier: Tier;
  claim: string;
  note: string;
  evidence: CitedEvidence[];
};

export type FitCheckResult = {
  role: string;
  requirements: ValidatedRequirement[];
  counts: Record<Tier, number>;
  /** How many citations the model invented and the server discarded. */
  droppedCitations: number;
};

/** Verifies model citations against the corpus. Throws FitCheckError if unusable. */
export function validateResult(parsed: unknown): FitCheckResult;

export function runFitCheck(opts: {
  jd: unknown;
  apiKey: string;
  signal?: AbortSignal;
}): Promise<FitCheckResult>;
