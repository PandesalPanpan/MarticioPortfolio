import { Rocket, ServerCog, MessageSquare, Cpu } from 'lucide-react';
import styles from './WhyMe.module.css';

const POINTS = [
  {
    Icon: Rocket,
    title: 'I ship, not just build',
    body: 'Projects go all the way to a live URL with real users, not a demo that dies on my laptop.',
  },
  {
    Icon: ServerCog,
    title: 'You own your stack',
    body: 'Dockerised and self-hosted on your own VPS. No vendor lock-in, no surprise SaaS bills, your data stays yours.',
  },
  {
    Icon: MessageSquare,
    title: 'A direct line to me',
    body: 'You talk to the person writing the code. No account managers, no telephone game, no lost context.',
  },
  {
    Icon: Cpu,
    title: 'Software + hardware',
    body: 'A Computer Engineering background means RFID, barcode, biometrics, and thermal printers are not scary edge cases.',
  },
];

export function WhyMe() {
  return (
    <section id="why" className={styles.section} aria-labelledby="why-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>Why work with me</p>
        <h2 id="why-title" className={styles.title}>
          A developer who owns the whole thing, start to shipped.
        </h2>
      </div>
      <ul className={styles.grid}>
        {POINTS.map(({ Icon, title, body }) => (
          <li key={title} className={styles.item}>
            <span className={styles.icon}>
              <Icon size={20} aria-hidden="true" />
            </span>
            <h3 className={styles.itemTitle}>{title}</h3>
            <p className={styles.body}>{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
