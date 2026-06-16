import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span suppressHydrationWarning>© {new Date().getFullYear()} Peter Elijah Marticio</span>
        <nav className={styles.nav} aria-label="Footer">
          <Link to="/colophon">Colophon</Link>
          <a href="https://github.com/PandesalPanpan/MarticioPortfolio">Source</a>
        </nav>
      </div>
    </footer>
  );
}
