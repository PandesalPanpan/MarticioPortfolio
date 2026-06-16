import { certifications } from '@/data/certifications';
import { CertCard } from '@/components/CertCard';
import styles from './Certifications.module.css';

export function Certifications() {
  return (
    <section id="certifications" className={styles.section} aria-labelledby="certifications-title">
      <h2 id="certifications-title">Certifications</h2>
      <div className={styles.grid}>
        {certifications.map((c) => (
          <CertCard key={c.id} cert={c} />
        ))}
      </div>
    </section>
  );
}
