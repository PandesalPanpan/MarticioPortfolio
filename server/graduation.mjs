// Mirror of src/data/graduation.ts. Kept as plain .mjs, for the same reason
// persona.mjs is: the Netlify function and the Vite dev middleware import it
// without a build step. tests/graduation.test.ts fails if the two drift.

export const GRADUATION_ISO = '2027-01-01';

export const GRADUATION_YEAR = '2027';

/** @param {Date} [now] @returns {boolean} */
export function hasGraduated(now = new Date()) {
  return now.getTime() >= new Date(`${GRADUATION_ISO}T00:00:00`).getTime();
}
