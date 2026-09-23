import styles from './AiAssistedDisclosure.module.css';

export function AiAssistedDisclosure() {
  return (
    <details className={styles.disclosure}>
      <summary className={styles.summary}>How I use AI</summary>
      <div className={styles.copy}>
        <p>
          Coding agents help me implement faster. I own the requirements and architecture, debug
          problems, review the code, and verify the finished work.
        </p>
        <p>
          “From Scratch” means I write the project code without AI assistance. Frameworks, libraries,
          and developer tools can still be part of the work.
        </p>
      </div>
    </details>
  );
}
