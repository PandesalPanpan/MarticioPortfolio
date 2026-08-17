import { certifications } from '@/data/certifications';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './Certifications.module.css';

export function Certifications() {
  return (
    <Reveal id="certs" labelledBy="certifications-title" className={styles.section}>
      <SectionHeading id="certifications-title">Certifications</SectionHeading>
      <div className={styles.grid}>
        {certifications.map((c) => (
          <div key={c.id} className={styles.card}>
            <h3 className={styles.title}>{c.title}</h3>
            <p className={styles.issuer}>{c.issuer} · {c.date}</p>
            {c.verifyUrl ? (
              <a href={c.verifyUrl} target="_blank" rel="noreferrer" className={styles.link}>
                Verify ↗
              </a>
            ) : (
              <a href={c.pdf} target="_blank" rel="noreferrer" className={`${styles.link} ${styles.muted}`}>
                PDF
              </a>
            )}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
