import { skills } from '@/data/skills';
import { SkillIcon } from '@/components/SkillIcon';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './Skills.module.css';

/** Per-chip delay for the staggered reveal, in ms. */
const STAGGER = 28;

export function Skills() {
  return (
    <Reveal id="skills" labelledBy="skills-title" className={styles.section}>
      <SectionHeading id="skills-title">Skills</SectionHeading>
      <div className={styles.groups}>
        {skills.map((group) => (
          <div key={group.id}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul className={styles.items}>
              {group.items.map((item, i) => (
                <li
                  key={item}
                  className={styles.chip}
                  style={{ transitionDelay: `${i * STAGGER}ms` }}
                >
                  <SkillIcon name={item} size={15} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
