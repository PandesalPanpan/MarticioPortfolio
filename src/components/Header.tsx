import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { VersionToggle } from './VersionToggle';
import { Monogram } from './Monogram';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Home">
          <Monogram size={32} />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <a href="/#services">Services</a>
          <a href="/#projects">Work</a>
          <a href="/#why">Why me</a>
          <Link to="/colophon">Colophon</Link>
        </nav>
        <div className={styles.controls}>
          <VersionToggle />
          <ThemeToggle />
          <a
            href="mailto:petermarticio@gmail.com?subject=Let%27s%20build%20something"
            className={styles.hire}
          >
            Hire me
          </a>
        </div>
      </div>
    </header>
  );
}
