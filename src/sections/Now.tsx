import { Reveal } from '@/components/Reveal';
import styles from './Now.module.css';

export function Now() {
  return (
    <Reveal id="now" className={styles.now}>
      <span className={styles.label}>Now</span>
      <p className={styles.body}>
        Building inventory systems at <span className={styles.strong}>Caret Solutions</span>,
        finishing Computer Engineering at PUP, and shipping side projects on my own VPS.
      </p>
    </Reveal>
  );
}
