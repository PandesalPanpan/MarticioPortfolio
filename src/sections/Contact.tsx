import { useId, useRef, type FormEvent } from 'react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './Contact.module.css';

const EMAIL = 'petermarticio@gmail.com';

const links = [
  { href: `mailto:${EMAIL}`, label: EMAIL },
  { href: 'https://github.com/PandesalPanpan', label: 'github.com/PandesalPanpan' },
  { href: 'https://www.linkedin.com/in/peter-elijah-a-marticio-46340125b/', label: 'LinkedIn' },
];

export function Contact() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const uid = useId();

  // There is no backend: the form composes a mailto: and hands off to whatever
  // mail client the visitor has. The plain address is listed alongside for
  // anyone without one configured.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value ?? '';
    const from = emailRef.current?.value ?? '';
    const message = msgRef.current?.value ?? '';
    const subject = encodeURIComponent(`Portfolio enquiry: ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom ${name} (${from})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <Reveal id="contact" labelledBy="contact-title">
      <SectionHeading id="contact-title">Get in touch</SectionHeading>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={submit}>
          <label className={styles.srOnly} htmlFor={`${uid}-name`}>Name</label>
          <input
            id={`${uid}-name`}
            ref={nameRef}
            className={styles.field}
            placeholder="Name"
            autoComplete="name"
            required
          />

          <label className={styles.srOnly} htmlFor={`${uid}-email`}>Email</label>
          <input
            id={`${uid}-email`}
            ref={emailRef}
            className={styles.field}
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
          />

          <label className={styles.srOnly} htmlFor={`${uid}-message`}>Message</label>
          <textarea
            id={`${uid}-message`}
            ref={msgRef}
            className={`${styles.field} ${styles.textarea}`}
            placeholder="What are you building?"
            rows={4}
            required
          />

          <button type="submit" className={styles.submit}>Send message</button>
        </form>

        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className={styles.note}>
            Based in Metro Manila, Philippines. Open to full-stack roles and freelance builds.
          </li>
        </ul>
      </div>
    </Reveal>
  );
}
