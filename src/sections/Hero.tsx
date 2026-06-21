import { Button } from '@/components/Button';
import { Term } from '@/components/Term';
import styles from './Hero.module.css';

/**
 * Optional hero portrait. To enable later: drop a headshot in /public
 * (e.g. /portrait.jpg) and set PORTRAIT to its path. The hero automatically
 * switches to a two-column layout with the photo; until then it's text-only.
 */
const PORTRAIT: string | null = null;

export function Hero() {
  return (
    <section
      className={`${styles.hero} ${PORTRAIT ? styles.withPortrait : ''}`}
      aria-labelledby="hero-title"
    >
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Full-Stack Developer · Computer Engineering @ PUP</p>
        <h1 id="hero-title" className={styles.title}>Peter Elijah Marticio</h1>
        <p className={styles.tagline}>
          Full-stack developer and Computer Engineering student. I write most of the{' '}
          <Term term="IMS">Inventory Management System</Term> at Caret Solutions and troubleshoot
          production directly when deploys hide bugs others miss. I self-host my apps on a{' '}
          <Term term="VPS">VPS</Term> and learn in the open via The Odin Project.
        </p>
        <div className={styles.actions}>
          <Button as="a" href="#projects" variant="primary">View Projects</Button>
          <Button as="a" href="/resume.pdf" variant="secondary" download>Download Resume</Button>
          <Button as="a" href="https://github.com/PandesalPanpan" variant="ghost">GitHub</Button>
        </div>
        <p className={styles.note}>
          This is the AI-assisted build. A from-scratch version is in progress — toggle above.
        </p>
      </div>
      {PORTRAIT && (
        <div className={styles.figure}>
          <img src={PORTRAIT} alt="Peter Elijah Marticio" className={styles.portrait} />
        </div>
      )}
    </section>
  );
}
