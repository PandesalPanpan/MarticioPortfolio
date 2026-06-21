import { useState } from 'react';
import { Play, Maximize2 } from 'lucide-react';
import type { Project } from '@/data/types';
import { Lightbox, type MediaItem } from './Lightbox';
import styles from './ProjectMedia.module.css';

/**
 * Renders a project's signature video (poster + click-to-play) and/or its
 * screenshot gallery. Everything opens in the shared Lightbox as one navigable
 * set (video first, then screenshots), so you can arrow between them without
 * closing. Nothing loads or plays until clicked.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const { video, gallery, title } = project;
  if (!video && !(gallery && gallery.length)) return null;

  const items: MediaItem[] = [
    ...(video ? [{ type: 'video' as const, src: video.src, poster: video.poster, title: `${title} — walkthrough` }] : []),
    ...(gallery ?? []).map((g) => ({ type: 'image' as const, src: g.src, title: g.caption })),
  ];
  const galleryOffset = video ? 1 : 0;

  return (
    <div className={styles.wrap}>
      {video && (
        <button
          type="button"
          className={styles.poster}
          onClick={() => setOpenAt(0)}
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
          {gallery.map((g, i) => (
            <li key={g.src}>
              <button
                type="button"
                className={styles.thumb}
                onClick={() => setOpenAt(galleryOffset + i)}
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
        open={openAt !== null}
        onClose={() => setOpenAt(null)}
        items={items}
        initialIndex={openAt ?? 0}
      />
    </div>
  );
}
