import { skills } from '@/data/skills';
import { Tag } from '@/components/Tag';
import { Term } from '@/components/Term';
import { SkillIcon } from '@/components/SkillIcon';
import styles from './Skills.module.css';

export function Skills() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <h2 id="skills-title">Skills</h2>
      <p className={styles.intro}>
        The stack I reach for. Hover any dotted term for a plain-language explainer.
      </p>
      <div className={styles.groups}>
        {skills.map((group) => (
          <div key={group.id} className={styles.group}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item}>
                  <Tag>
                    <span className={styles.chip}>
                      <SkillIcon name={item} />
                      <Term term={item}>{item}</Term>
                    </span>
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
