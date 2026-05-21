import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { VersionToggle } from './VersionToggle';
import monogram from '@/assets/monogram.svg';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Home">
          <img src={monogram} alt="" width={32} height={32} />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <Link to="/#projects">Projects</Link>
          <Link to="/#experience">Experience</Link>
          <Link to="/colophon">Colophon</Link>
        </nav>
        <div className={styles.controls}>
          <VersionToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
