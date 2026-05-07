import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

type BaseProps = { variant?: Variant; children: ReactNode };

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = 'primary', children, className = '', ...rest } = props as ButtonProps & AnchorProps;
  const cls = `${styles.btn} ${styles[variant]} ${className}`.trim();
  if (props.as === 'a') {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
