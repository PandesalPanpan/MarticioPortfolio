import styles from './Colophon.module.css';

export default function Colophon() {
  return (
    <main className={styles.main}>
      <h1>Colophon</h1>
      <section>
        <h2>Why I am building two versions</h2>
        <p>
          AI-assisted coding is part of how I work. This version makes my process visible: coding
          agents speed up implementation while I own the requirements, architecture, debugging,
          review, and verification. I am also writing a version without AI coding assistance; it is
          still in progress at <code>/handmade</code>.
        </p>
      </section>
      <section>
        <h2>What's on this version (AI-Assisted)</h2>
        <ul>
          <li>Stack: Vite, React 19, TypeScript, React Router, Zustand, Framer Motion, CSS Modules.</li>
          <li>AI assisted with scaffolding, initial component drafts, theme tokens, and animation variants.</li>
          <li>I set the architecture and requirements, review the code, debug failures, and verify the result.</li>
          <li>Threw out: a few overreaching motion ideas that ignored <code>prefers-reduced-motion</code>.</li>
        </ul>
      </section>
      <section>
        <h2>What's on the other version (From Scratch)</h2>
        <ul>
          <li>Same constraints: Vite, React, TS, CSS Modules. No AI tools.</li>
          <li>Status: in progress.</li>
        </ul>
      </section>
      <section>
        <h2>What I am comparing</h2>
        <p>
          I am keeping the content and design goals comparable so the difference is the build
          process. The handmade version is still in progress.
        </p>
      </section>
      <p className={styles.source}>
        <a href="https://github.com/PandesalPanpan/MarticioPortfolio">Source code: GitHub →</a>
      </p>
    </main>
  );
}
