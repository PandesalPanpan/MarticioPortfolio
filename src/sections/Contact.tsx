import { Mail, Github, Linkedin } from 'lucide-react';
import { BoopIcon } from '@/components/BoopIcon';
import styles from './Contact.module.css';

const links = [
  { href: 'mailto:petermarticio@gmail.com', label: 'petermarticio@gmail.com', Icon: Mail },
  { href: 'https://github.com/PandesalPanpan', label: 'github.com/PandesalPanpan', Icon: Github },
  {
    href: 'https://www.linkedin.com/in/peter-elijah-a-marticio-46340125b/',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
];

export function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <h2 id="contact-title">Get in touch</h2>
      <ul className={styles.list}>
        {links.map(({ href, label, Icon }) => (
          <li key={href}>
            <a href={href} className={styles.link}>
              <BoopIcon>
                <Icon size={20} />
              </BoopIcon>
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
