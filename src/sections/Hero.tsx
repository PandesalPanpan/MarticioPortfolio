import { Term } from '@/components/Term';
import { hasGraduated } from '@/data/graduation';
import styles from './Hero.module.css';

const PORTRAIT = '/formal_pic.jpg';

const OSS_CONTRIBUTIONS_URL =
  'https://github.com/TheOdinProject/curriculum/pulls?q=is%3Apr+is%3Amerged+author%3APandesalPanpan';

export function Hero() {
  const standing = hasGraduated() ? 'graduate' : 'student';
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          Full-Stack Developer · Computer Engineering @ PUP
        </p>
        <h1 id="hero-title" className={styles.title}>
          Peter Elijah Marticio
        </h1>
        <p className={styles.tagline}>
          Full-stack developer and Computer Engineering {standing}. I build full-stack web apps
          and <Term term="IMS">Inventory Management Systems</Term> that run in production,
          self-host my projects on a <Term term="VPS">VPS</Term>, and{' '}
          <a href={OSS_CONTRIBUTIONS_URL} target="_blank" rel="noreferrer">
            contribute to open source
          </a>{' '}
          while learning in the open via The Odin Project.
        </p>
        <div className={styles.actions}>
          <a href="#projects" className={styles.primary}>View projects</a>
          <a href="/resume.pdf" download className={styles.secondary}>Download resume</a>
          <a
            href="https://github.com/PandesalPanpan"
            target="_blank"
            rel="noreferrer"
            className={styles.ghost}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      <div className={styles.figure}>
        <img
          src={PORTRAIT}
          alt="Portrait of Peter Elijah Marticio"
          className={styles.portrait}
          width={150}
          height={186}
        />
      </div>
    </section>
  );
}
