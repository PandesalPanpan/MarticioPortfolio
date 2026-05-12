import { ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';
import styles from './Projects.module.css';

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.head}>
        <h2 id="projects-title">Featured Projects</h2>
      </div>
      <div className={styles.grid}>
        {featured.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      <a className={styles.more} href="https://github.com/PandesalPanpan?tab=repositories">
        More on GitHub <ArrowRight size={14} />
      </a>
      <p className={styles.legend}>
        Projects are labeled by build style. <em>AI-Assisted</em> means I used AI tooling
        (Claude Code, Copilot) as a pair-programmer — I drove the architecture, made the calls,
        and reviewed everything. <em>From Scratch</em> means no AI was used. Both are mine.
      </p>
    </section>
  );
}
