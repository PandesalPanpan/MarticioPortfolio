import { NavLink, useLocation } from 'react-router-dom';
import styles from './VersionToggle.module.css';

export function VersionToggle() {
  const { pathname } = useLocation();
  const isHandmade = pathname.startsWith('/handmade');
  return (
    <fieldset className={styles.toggle} aria-label="Site version">
      <NavLink
        to="/"
        className={!isHandmade ? `${styles.option} ${styles.active}` : styles.option}
        aria-current={!isHandmade ? 'page' : undefined}
      >
        Agentic
      </NavLink>
      <NavLink
        to="/handmade"
        className={isHandmade ? `${styles.option} ${styles.active}` : styles.option}
        aria-current={isHandmade ? 'page' : undefined}
      >
        Handmade
      </NavLink>
    </fieldset>
  );
}
