import type { Project } from '@/data/types';
import { BuildBadge } from './BuildBadge';
import { ProjectMedia } from './ProjectMedia';
import { Reveal } from './Reveal';
import styles from './ProjectCard.module.css';

export function ProjectCard({ project }: { project: Project }) {
  // The long-form copy is the card body here; the short blurb is the fallback
  // for projects that never got a longer write-up.
  const body = project.description ?? project.blurb;

  return (
    <Reveal as="article" className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{project.title}</h3>
        <BuildBadge style={project.buildStyle} />
        <span className={styles.spacer} />
        <div className={styles.links}>
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noreferrer">Live ↗</a>
          )}
          {project.links.code && (
            <a href={project.links.code} target="_blank" rel="noreferrer" className={styles.muted}>
              Source ↗
            </a>
          )}
        </div>
      </div>

      <p className={styles.blurb}>{body}</p>

      <dl className={styles.meta}>
        <dt>Role</dt>
        <dd>{project.role}</dd>
        <dt>Status</dt>
        <dd>{project.status}</dd>
      </dl>

      {project.engineeringDecision ? (
        <div className={styles.decision}>
          <span className={styles.decisionLabel}>Engineering decision</span>
          <p className={styles.decisionText}>{project.engineeringDecision}</p>
        </div>
      ) : null}

      {project.evidence?.length ? (
        <div className={styles.evidence}>
          <span className={styles.evidenceLabel}>Evidence</span>
          <ul className={styles.evidenceList}>
            {project.evidence.map((item) => (
              <li key={item} className={styles.evidenceBadge}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.highlights?.length ? (
        <ul className={styles.highlights}>
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}

      <div className={styles.tech}>
        {project.tech.map((t) => (
          <span key={t} className={styles.chip}>{t}</span>
        ))}
      </div>

      <ProjectMedia project={project} />
    </Reveal>
  );
}
