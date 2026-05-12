import { experience } from '@/data/experience';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <h2 id="experience-title">Experience</h2>
      <ol className={styles.timeline}>
        {experience.map((e) => (
          <li key={e.id} className={styles.item}>
            <div className={styles.dates}>
              {e.start}{e.end ? ` – ${e.end}` : ''}
            </div>
            <div className={styles.body}>
              <h3 className={styles.role}>
                {e.role} · <span className={styles.company}>{e.company}</span>
              </h3>
              <ul className={styles.bullets}>
                {e.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
