import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span suppressHydrationWarning>© {new Date().getFullYear()} marticio.com</span>
      {/* The design's footer is just the two end labels; these keep the
          standalone routes reachable now that they are out of the header. */}
      <nav className={styles.nav} aria-label="Footer">
        <Link to="/colophon">Colophon</Link>
        <Link to="/handmade">Handmade</Link>
      </nav>
      <span>Self-hosted on a VPS</span>
    </footer>
  );
}
