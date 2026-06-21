import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { VersionToggle } from './VersionToggle';
import { AvatarMark } from './Avatar';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Home">
          <AvatarMark size={32} />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <a href="/#experience">Experience</a>
          <a href="/#skills">Skills</a>
          <a href="/#projects">Projects</a>
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
