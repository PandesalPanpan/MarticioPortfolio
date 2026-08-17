import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

const NAV = [
  { href: '/#work', label: 'work' },
  { href: '/#projects', label: 'projects' },
  { href: '/#skills', label: 'skills' },
  { href: '/#contact', label: 'contact' },
];

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <a href="/#top" className={styles.brand} aria-label="Home">pem/</a>
      <nav className={styles.nav} aria-label="Primary">
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>{n.label}</a>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  );
}
