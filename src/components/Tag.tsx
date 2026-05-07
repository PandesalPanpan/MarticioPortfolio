import styles from './Tag.module.css';

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className={styles.tag}>{children}</span>;
}
