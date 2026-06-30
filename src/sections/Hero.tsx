import { Button } from '@/components/Button';
import { Term } from '@/components/Term';
import styles from './Hero.module.css';

/**
 * Hero portrait. Set PORTRAIT to null to fall back to the text-only layout.
 * When set, the hero switches to a two-column layout with the photo.
 */
const PORTRAIT: string | null = '/formal_pic.jpg';

/** Merged pull requests on The Odin Project curriculum, authored by Peter. */
const OSS_CONTRIBUTIONS_URL =
  'https://github.com/TheOdinProject/curriculum/pulls?q=is%3Apr+is%3Amerged+author%3APandesalPanpan';

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
          Full-stack developer and Computer Engineering student. I build full-stack web apps
          and <Term term="IMS">Inventory Management Systems</Term> that run in production,
          self-host my projects on a <Term term="VPS">VPS</Term>, and{' '}
          <a href={OSS_CONTRIBUTIONS_URL} target="_blank" rel="noreferrer">
            contribute to open source
          </a>{' '}
          while learning in the open via The Odin Project.
        </p>
        <div className={styles.actions}>
          <Button as="a" href="#projects" variant="primary">View Projects</Button>
          <Button as="a" href="/resume.pdf" variant="secondary" download>Download Resume</Button>
          <Button as="a" href="https://github.com/PandesalPanpan" variant="ghost" target="_blank" rel="noreferrer">GitHub</Button>
        </div>
        <p className={styles.note}>
          This is the AI-assisted build. A from-scratch version is in progress — toggle above.
        </p>
      </div>
      {PORTRAIT && (
        <div className={styles.figure}>
          <img
            src={PORTRAIT}
            alt="Portrait of Peter Elijah Marticio in a barong"
            className={styles.portrait}
            width={300}
            height={400}
          />
        </div>
      )}
    </section>
  );
}
