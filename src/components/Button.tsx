import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

type BaseProps = { variant?: Variant; children: ReactNode };

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

export function Button(props: ButtonProps | AnchorProps) {
  if (props.as === 'a') {
    const { variant = 'primary', children, className = '', ...rest } = props;
    const cls = `${styles.btn} ${styles[variant]} ${className}`.trim();
    return (
      <a className={cls} {...rest}>
        {children}
      </a>
    );
  }
  const { variant = 'primary', children, className = '', ...rest } = props;
  const cls = `${styles.btn} ${styles[variant]} ${className}`.trim();
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
