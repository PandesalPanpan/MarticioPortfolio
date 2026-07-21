import { Button } from '@/components/Button';
import { Term } from '@/components/Term';
import styles from './Hero.module.css';

/**
 * Hero portrait. Set PORTRAIT to null to fall back to the text-only layout.
 * When set, the hero switches to a two-column layout with the photo.
 */
const PORTRAIT: string | null = '/formal_pic.jpg';

const CONTACT_EMAIL = 'mailto:petermarticio@gmail.com?subject=Let%27s%20build%20something';

/** Quick trust signals shown under the hero copy. */
const STATS = [
  { value: '4', label: 'apps in production' },
  { value: '1,000+', label: 'items managed in systems I built' },
  { value: '30%', label: 'faster checkout shipped for a client' },
];

export function Hero() {
  return (
    <section
      className={`${styles.hero} ${PORTRAIT ? styles.withPortrait : ''}`}
      aria-labelledby="hero-title"
    >
      <div className={styles.copy}>
        <p className={styles.badge}>
          <span className={styles.dot} aria-hidden="true" />
          Available for freelance &amp; full-time work
        </p>
        <p className={styles.name}>
          Peter Elijah Marticio · Full-Stack Developer
        </p>
        <h1 id="hero-title" className={styles.title}>
          I build software that runs your business.
        </h1>
        <p className={styles.tagline}>
          Full-stack developer and Computer Engineering student. I design, build, and ship
          production web apps, <Term term="IMS">inventory &amp; POS systems</Term>, and internal
          tools, then deploy and self-host them on a <Term term="VPS">VPS</Term> so they keep
          running long after launch.
        </p>
        <div className={styles.actions}>
          <Button as="a" href={CONTACT_EMAIL} variant="primary">Hire me</Button>
          <Button as="a" href="#projects" variant="secondary">See what I build</Button>
        </div>
        <dl className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt className={styles.statValue}>{s.value}</dt>
              <dd className={styles.statLabel}>{s.label}</dd>
            </div>
          ))}
        </dl>
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
