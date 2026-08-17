import { useState } from 'react';
import { Play } from 'lucide-react';
import type { Project } from '@/data/types';
import { Lightbox, type MediaItem } from './Lightbox';
import styles from './ProjectMedia.module.css';

/** Tiles shown on the card; the rest are reachable by paging the lightbox. */
const MAX_TILES = 4;

/**
 * A project's signature video and screenshots as one navigable set (video
 * first), shown as a capped grid of thumbnails. Nothing loads or plays until
 * a tile is clicked.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const { video, gallery, title } = project;
  if (!video && !gallery?.length) return null;

  const items: MediaItem[] = [
    ...(video
      ? [{ type: 'video' as const, src: video.src, poster: video.poster, title: `${title} walkthrough` }]
      : []),
    ...(gallery ?? []).map((g) => ({ type: 'image' as const, src: g.src, title: g.caption })),
  ];

  const tiles = items.slice(0, MAX_TILES);
  const extra = items.length - tiles.length;

  return (
    <div className={styles.wrap}>
      <ul className={styles.grid}>
        {tiles.map((item, i) => {
          const isVideo = item.type === 'video';
          const showMore = extra > 0 && i === tiles.length - 1;
          return (
            <li key={item.src} className={styles.cell}>
              <figure className={styles.figure}>
                <button
                  type="button"
                  className={styles.thumb}
                  onClick={() => setOpenAt(i)}
                  title={item.title}
                  aria-label={
                    showMore
                      ? `View ${item.title} and ${extra} more`
                      : isVideo
                        ? `Play ${item.title}`
                        : `View screenshot: ${item.title}`
                  }
                >
                  <img
                    src={isVideo ? item.poster : item.src}
                    alt=""
                    loading="lazy"
                    className={styles.thumbImg}
                  />
                  {isVideo && !showMore && (
                    <span className={styles.play} aria-hidden="true">
                      <Play size={18} fill="currentColor" />
                    </span>
                  )}
                  {showMore && (
                    <span className={styles.more} aria-hidden="true">+{extra} more</span>
                  )}
                </button>
                <figcaption className={styles.caption}>{item.title}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      <Lightbox
        open={openAt !== null}
        onClose={() => setOpenAt(null)}
        items={items}
        initialIndex={openAt ?? 0}
      />
    </div>
  );
}
