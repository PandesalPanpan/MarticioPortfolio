import { Reveal } from '@/components/Reveal';
import { hasGraduated } from '@/data/graduation';
import styles from './Now.module.css';

export function Now() {
  const study = hasGraduated()
    ? 'newly graduated in Computer Engineering from PUP'
    : 'finishing Computer Engineering at PUP';

  return (
    <Reveal id="now" className={styles.now}>
      <span className={styles.label}>Now</span>
      <p className={styles.body}>
        Building inventory systems at <span className={styles.strong}>Caret Solutions</span>,{' '}
        {study}, and shipping side projects on my own VPS.
      </p>
    </Reveal>
  );
}
