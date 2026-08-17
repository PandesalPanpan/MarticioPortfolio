import { Button } from '@/components/Button';
import styles from './FinalCta.module.css';

const CONTACT_EMAIL = 'mailto:petermarticio@gmail.com?subject=Let%27s%20build%20something';

export function FinalCta() {
  return (
    <section id="hire" className={styles.section} aria-labelledby="cta-title">
      <div className={styles.card}>
        <p className={styles.eyebrow}>Have something to build?</p>
        <h2 id="cta-title" className={styles.title}>
          Let&apos;s turn it into software that ships.
        </h2>
        <p className={styles.sub}>
          Tell me what your business needs. I&apos;ll reply with how I&apos;d build it. Most
          questions are sorted in a short call: no pressure, no slides.
        </p>
        <div className={styles.actions}>
          <Button as="a" href={CONTACT_EMAIL} variant="primary">Hire me</Button>
          <Button as="a" href="/resume.pdf" variant="secondary" download>Download resume</Button>
        </div>
      </div>
    </section>
  );
}
