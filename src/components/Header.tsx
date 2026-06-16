import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { VersionToggle } from './VersionToggle';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Home">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" width={32} height={32}>
            <rect width="40" height="40" rx="8" fill="currentColor" opacity="0.06"/>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle"
                  fontFamily="Fraunces, Georgia, serif" fontWeight="600" fontSize="16" fill="currentColor">PM</text>
          </svg>
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <a href="/#projects">Projects</a>
          <a href="/#experience">Experience</a>
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
