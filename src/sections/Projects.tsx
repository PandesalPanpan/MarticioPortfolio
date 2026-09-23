import { projects } from '@/data/projects';
import { AiAssistedDisclosure } from '@/components/AiAssistedDisclosure';
import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './Projects.module.css';

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  return (
    <Reveal id="projects" labelledBy="projects-title" className={styles.section}>
      <SectionHeading
        id="projects-title"
        trailing={<span className={styles.count}>{featured.length} shipped</span>}
      >
        Projects
      </SectionHeading>
      <AiAssistedDisclosure />
      <div className={styles.list}>
        {featured.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Reveal>
  );
}
