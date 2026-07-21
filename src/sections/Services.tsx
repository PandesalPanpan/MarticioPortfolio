import { Check } from 'lucide-react';
import { services } from '@/data/services';
import styles from './Services.module.css';

export function Services() {
  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>What I can build for you</p>
        <h2 id="services-title" className={styles.title}>
          Software that earns its keep. Designed, built, and kept running.
        </h2>
      </div>
      <div className={styles.grid}>
        {services.map((s) => (
          <article key={s.id} className={styles.card}>
            <span className={styles.no} aria-hidden="true">{s.no}</span>
            <h3 className={styles.cardTitle}>{s.title}</h3>
            <p className={styles.blurb}>{s.blurb}</p>
            <ul className={styles.bullets}>
              {s.bullets.map((b) => (
                <li key={b}>
                  <Check size={16} aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
