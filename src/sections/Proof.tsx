import styles from './Proof.module.css';

/** Merged pull requests on The Odin Project curriculum, authored by Peter. */
const OSS_CONTRIBUTIONS_URL =
  'https://github.com/TheOdinProject/curriculum/pulls?q=is%3Apr+is%3Amerged+author%3APandesalPanpan';

const METRICS = [
  { value: '300–500', label: 'daily transactions handled by a POS I built' },
  { value: '1,000+', label: 'items managed in a live inventory system' },
  { value: '30%', label: 'faster checkout after Bluetooth print integration' },
  { value: '500+', label: 'daily transactions monitored in real time' },
];

export function Proof() {
  return (
    <section className={styles.band} aria-labelledby="proof-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Proven in production</p>
        <h2 id="proof-title" className={styles.title}>
          Not side projects. Systems real businesses depend on.
        </h2>
        <dl className={styles.metrics}>
          {METRICS.map((m) => (
            <div key={m.label} className={styles.metric}>
              <dt className={styles.value}>{m.value}</dt>
              <dd className={styles.label}>{m.label}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.trust}>
          Shipped during hands-on roles at{' '}
          <strong>Caret Solutions</strong>, <strong>Meta Core Systems</strong>, and{' '}
          <strong>NTEK Systems</strong>. I also{' '}
          <a href={OSS_CONTRIBUTIONS_URL} target="_blank" rel="noreferrer">
            contribute to open source
          </a>{' '}
          on The Odin Project curriculum.
        </p>
      </div>
    </section>
  );
}
