import styles from './Colophon.module.css';

export default function Colophon() {
  return (
    <main className={styles.main}>
      <h1>Colophon</h1>
      <section>
        <h2>Why two versions of this site exist</h2>
        <p>
          AI-assisted coding is the reality of how I work now. But I also want to show I can build
          without it. So this site ships in two versions — the one you're on, built with AI
          pair-programming, and a from-scratch version I'm hand-writing in parallel. Toggle between
          them in the header. Same content, different process.
        </p>
      </section>
      <section>
        <h2>What's on this version (AI-Assisted)</h2>
        <ul>
          <li>Stack: Vite, React 19, TypeScript, React Router, Zustand, Framer Motion, CSS Modules.</li>
          <li>AI did: scaffolding, initial component drafts, theme tokens, animation variants.</li>
          <li>I did: architecture decisions, the dual-build framing, content, palette, every public-facing copy line.</li>
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
        <h2>What stays the same across both</h2>
        <p>
          Project data lives in the same <code>projects.ts</code>. Both versions deploy as static
          sites and pass the same Lighthouse budget. The experiment isolates <em>process</em>, not
          <em> outcome</em>.
        </p>
      </section>
      <p className={styles.source}>
        <a href="https://github.com/PandesalPanpan/MarticioPortfolio">Source code: GitHub →</a>
      </p>
    </main>
  );
}
