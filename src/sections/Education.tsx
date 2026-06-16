import { education } from '@/data/education';
import { Card } from '@/components/Card';
import styles from './Education.module.css';

export function Education() {
  return (
    <section id="education" className={styles.section} aria-labelledby="education-title">
      <h2 id="education-title">Education</h2>
      <div className={styles.grid}>
        {education.map((e) => (
          <Card key={e.id} className={styles.item}>
            <h3 className={styles.institution}>{e.institution}</h3>
            <p className={styles.credential}>{e.credential}</p>
            <p className={styles.dates}>
              {e.start}{e.end ? (e.start ? ` – ${e.end}` : e.end) : ''}
            </p>
            {e.note && <p className={styles.note}>{e.note}</p>}
            <div className={styles.links}>
              {e.link && <a href={e.link} className={styles.link}>Learn more →</a>}
              {e.contribution && (
                <a href={e.contribution.url} className={styles.link} target="_blank" rel="noreferrer">
                  {e.contribution.label} →
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
