import { useState } from 'react';
import { ExternalLink, Code2, ChevronDown } from 'lucide-react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/types';
import { Card } from './Card';
import { Tag } from './Tag';
import { BuildBadge } from './BuildBadge';
import styles from './ProjectCard.module.css';

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = !!(project.description || project.highlights?.length);
  const panelId = `project-${project.id}-details`;

  return (
    <Card className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{project.title}</h3>
        <BuildBadge style={project.buildStyle} />
      </div>
      <p className={styles.blurb}>{project.blurb}</p>
      <div className={styles.tech}>
        {project.tech.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className={styles.actions}>
        {project.links.live && (
          <a href={project.links.live} className={styles.link}>
            <ExternalLink size={14} /> Live
          </a>
        )}
        {project.links.code && (
          <a href={project.links.code} className={styles.link}>
            <Code2 size={14} /> Code
          </a>
        )}
        {hasDetails && (
          <button
            type="button"
            className={styles.expand}
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronDown
              size={14}
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
            />
            {expanded ? 'Less' : 'More'}
          </button>
        )}
      </div>
      <LazyMotion features={domAnimation}>
        <AnimatePresence initial={false}>
          {expanded && hasDetails && (
            <m.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={styles.detailsWrap}
            >
              <div className={styles.details}>
                {project.description && <p>{project.description}</p>}
                {project.highlights?.length ? (
                  <ul>
                    {project.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </Card>
  );
}
