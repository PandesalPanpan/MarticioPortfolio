import { useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { experience } from '@/data/experience';
import { education } from '@/data/education';
import { GRADUATION_YEAR, hasGraduated } from '@/data/graduation';
import styles from './Background.module.css';

type Entry = {
  id: string;
  period: string;
  title: string;
  sub: string;
  bullets: string[];
  link?: { label: string; url: string };
};

/**
 * "2021–Present", or just the start when there is no end date. When both ends
 * share a year the leading one is dropped ("Mar 2024"/"Aug 2024" -> "Mar–Aug
 * 2024") so the date column does not wrap.
 */
function period(start: string, end: string) {
  if (!end) return start;
  const startYear = start.match(/\b(\d{4})$/)?.[1];
  const endYear = end.match(/\b(\d{4})$/)?.[1];
  if (startYear && startYear === endYear) {
    return `${start.slice(0, -startYear.length).trim()}–${end}`;
  }
  return `${start}–${end}`;
}

const WORK: Entry[] = experience.map((e) => ({
  id: e.id,
  period: period(e.start, e.end),
  title: e.company,
  sub: e.role,
  bullets: e.bullets,
}));

/** Built per render so the in-progress degree closes out on graduation day. */
function buildEducation(): Entry[] {
  const graduated = hasGraduated();
  return education.map((e) => ({
    id: e.id,
    period: period(e.start, e.endsOnGraduation && graduated ? GRADUATION_YEAR : e.end),
    title: e.institution,
    sub: e.credential,
    bullets: e.note ? [e.note] : [],
    link: e.contribution,
  }));
}

export function Background() {
  const [tab, setTab] = useState<'work' | 'edu'>('work');
  const sectionRef = useRef<HTMLDivElement>(null);

  // The two panels differ in height, so switching tabs would otherwise yank the
  // section out from under the pointer. Re-anchor it to where it started.
  const select = (next: 'work' | 'edu') => {
    const before = sectionRef.current?.getBoundingClientRect().top ?? null;
    setTab(next);
    if (before === null) return;
    requestAnimationFrame(() => {
      const after = sectionRef.current?.getBoundingClientRect().top;
      if (after === undefined) return;
      const drift = after - before;
      if (Math.abs(drift) > 1) window.scrollBy(0, drift);
    });
  };

  const TABS = [
    { id: 'work', label: 'Work', entries: WORK },
    { id: 'edu', label: 'Education', entries: buildEducation() },
  ] as const;

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <Reveal id="work" labelledBy="background-title" className={styles.section}>
      <div ref={sectionRef}>
        <SectionHeading
          id="background-title"
          trailing={
            <div className={styles.tabs} role="tablist" aria-label="Background">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                  onClick={() => select(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          }
        >
          Background
        </SectionHeading>

        <div
          className={styles.list}
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
        >
          {active.entries.map((e) => (
            <div key={e.id} className={styles.entry}>
              <p className={styles.period}>{e.period}</p>
              <div>
                <h3 className={styles.title}>{e.title}</h3>
                <p className={styles.sub}>{e.sub}</p>
                {e.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {e.link && (
                  <a
                    className={styles.link}
                    href={e.link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {e.link.label} ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
