import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { Certification } from '@/data/types';
import { Card } from './Card';
import { Lightbox } from './Lightbox';
import styles from './CertCard.module.css';

export function CertCard({ cert }: { cert: Certification }) {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: 'Download PDF', href: cert.pdf },
    ...(cert.verifyUrl ? [{ label: 'Verify ↗', href: cert.verifyUrl }] : []),
  ];

  return (
    <Card className={styles.card}>
      <button
        type="button"
        className={styles.thumbButton}
        onClick={() => setOpen(true)}
        aria-label={`View ${cert.title} certificate`}
      >
        <img src={cert.thumb} alt="" className={styles.thumb} loading="lazy" />
        <span className={styles.zoom} aria-hidden="true">
          <Maximize2 size={16} />
        </span>
      </button>
      <div className={styles.body}>
        <h3 className={styles.title}>{cert.title}</h3>
        <p className={styles.meta}>
          {cert.issuer} · {cert.date}
        </p>
      </div>
      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        items={[{ type: 'image', src: cert.image, title: cert.title }]}
        actions={actions}
      />
    </Card>
  );
}
