import { Button } from '@/components/Button';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <p className={styles.eyebrow}>Full-Stack Developer · Computer Engineering @ PUP</p>
      <h1 id="hero-title" className={styles.title}>Peter Elijah Marticio</h1>
      <p className={styles.tagline}>
        Computer Engineering student building full-stack apps end-to-end — from VPS self-hosting to
        Flutter POS systems. Active contributor to The Odin Project.
      </p>
      <div className={styles.actions}>
        <Button as="a" href="#projects" variant="primary">View Projects</Button>
        <Button as="a" href="/cv.pdf" variant="secondary" download>Download CV</Button>
        <Button as="a" href="https://github.com/PandesalPanpan" variant="ghost">GitHub</Button>
      </div>
      <p className={styles.note}>
        This is the AI-assisted build. A from-scratch version is in progress — toggle above.
      </p>
    </section>
  );
}
