import { useState } from 'react';
import { Play, Maximize2 } from 'lucide-react';
import type { Project } from '@/data/types';
import { Lightbox } from './Lightbox';
import styles from './ProjectMedia.module.css';

type Active =
  | { kind: 'video'; title: string; image: string; video: string }
  | { kind: 'image'; title: string; image: string }
  | null;

/**
 * Renders a project's signature video (poster + click-to-play) and/or its
 * screenshot gallery. Everything opens in the shared Lightbox; nothing loads or
 * plays until the user clicks, so it's bandwidth- and reduced-motion friendly.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const [active, setActive] = useState<Active>(null);
  const { video, gallery, title } = project;
  if (!video && !(gallery && gallery.length)) return null;

  return (
    <div className={styles.wrap}>
      {video && (
        <button
          type="button"
          className={styles.poster}
          onClick={() => setActive({ kind: 'video', title: `${title} — walkthrough`, image: video.poster, video: video.src })}
          aria-label={`Play ${title} walkthrough video`}
        >
          <img src={video.poster} alt="" className={styles.posterImg} loading="lazy" />
          <span className={styles.playBadge} aria-hidden="true">
            <Play size={20} fill="currentColor" />
          </span>
        </button>
      )}

      {gallery && gallery.length > 0 && (
        <ul className={styles.gallery}>
          {gallery.map((g) => (
            <li key={g.src}>
              <button
                type="button"
                className={styles.thumb}
                onClick={() => setActive({ kind: 'image', title: g.caption, image: g.src })}
                aria-label={`View screenshot: ${g.caption}`}
              >
                <img src={g.src} alt="" className={styles.thumbImg} loading="lazy" />
                <span className={styles.zoom} aria-hidden="true">
                  <Maximize2 size={14} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        open={active !== null}
        onClose={() => setActive(null)}
        title={active?.title ?? ''}
        image={active?.image ?? ''}
        video={active?.kind === 'video' ? active.video : undefined}
      />
    </div>
  );
}
