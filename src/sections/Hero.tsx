import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { Term } from '@/components/Term';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Full-Stack Developer · Computer Engineering @ PUP</p>
        <h1 id="hero-title" className={styles.title}>Peter Elijah Marticio</h1>
        <p className={styles.tagline}>
          Computer Engineering student building full-stack apps end-to-end — from{' '}
          <Term term="VPS">VPS</Term> self-hosting to a production{' '}
          <Term term="IMS">Inventory Management System</Term> at Caret Solutions. I sharpen my craft
          through The Odin Project, an open-source curriculum where I build and submit projects in
          the open.
        </p>
        <div className={styles.actions}>
          <Button as="a" href="#projects" variant="primary">View Projects</Button>
          <Button as="a" href="/resume.pdf" variant="secondary" download>Download Résumé</Button>
          <Button as="a" href="https://github.com/PandesalPanpan" variant="ghost">GitHub</Button>
        </div>
        <p className={styles.subActions}>
          Prefer the long form? <a href="/cv.pdf" download>Download CV</a>
        </p>
        <p className={styles.note}>
          This is the AI-assisted build. A from-scratch version is in progress — toggle above.
        </p>
      </div>
      <div className={styles.figure} aria-hidden="false">
        <Avatar size={260} />
      </div>
    </section>
  );
}
