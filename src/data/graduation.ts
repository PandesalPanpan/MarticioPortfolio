/**
 * Peter finishes his Computer Engineering degree at PUP at the end of 2026, so
 * from this date the site stops calling him a student and starts calling him a
 * graduate. Move this one constant if the date shifts.
 *
 * Compared against local time on purpose: a visitor should see the change on
 * their own 1 January, not on a fixed UTC instant.
 *
 * Mirrored in server/graduation.mjs, which the chatbot uses. The server files
 * are deliberately plain .mjs so the Netlify function and the Vite dev
 * middleware can import them with no build step, which is why this is a copy
 * rather than a shared import. tests/graduation.test.ts fails if the two drift.
 */
export const GRADUATION_ISO = '2027-01-01';

/** The year the degree is conferred; shown on the education entry once passed. */
export const GRADUATION_YEAR = '2027';

export function hasGraduated(now: Date = new Date()): boolean {
  return now.getTime() >= new Date(`${GRADUATION_ISO}T00:00:00`).getTime();
}
