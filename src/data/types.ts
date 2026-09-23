export type BuildStyle = 'ai-assisted' | 'from-scratch';

/** A still image shown in the project card gallery; opens full-size in the lightbox. */
export type GalleryItem = {
  /** Path (in /public) to the image. */
  src: string;
  /** Short caption / alt text. */
  caption: string;
};

/** A signature walkthrough video: poster shown on the card, video plays in the lightbox. */
export type ProjectVideo = {
  /** Path (in /public) to the poster still. */
  poster: string;
  /** Path (in /public) to the video file (webm/mp4). */
  src: string;
};

export type Project = {
  id: string;
  title: string;
  blurb: string;
  description?: string;
  /** How I contributed, e.g. "Sole developer". Shown in the card's Role row. */
  role: string;
  /** Where it stands today, e.g. "Live · self-hosted". Shown in the Status row. */
  status: string;
  tech: string[];
  buildStyle: BuildStyle;
  links: { live?: string; code?: string };
  featured: boolean;
  /** A concise explanation of a meaningful implementation choice. */
  engineeringDecision?: string;
  /** Compact supporting proof, such as tests, deployment, or hardware integration. */
  evidence?: string[];
  highlights?: string[];
  /** Optional signature video (poster + click-to-play in the lightbox). */
  video?: ProjectVideo;
  /** Optional screenshot gallery (thumbnails open in the lightbox). */
  gallery?: GalleryItem[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Education = {
  id: string;
  institution: string;
  credential: string;
  start: string;
  end: string;
  /**
   * Marks the in-progress degree. Until the graduation date passes the entry
   * shows `end`; after it, the conferral year. See src/data/graduation.ts.
   */
  endsOnGraduation?: boolean;
  link?: string;
  note?: string;
  /** Optional secondary call-to-action, e.g. open-source contributions. */
  contribution?: { label: string; url: string };
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  /**
   * Imported certificate scans. Optional: the current cards link out to the
   * issuer instead of showing the image, and importing these pulls the full
   * webp files into the bundle. The assets are still in src/assets/certs.
   */
  image?: string;
  thumb?: string;
  /** Path to the original PDF in /public (download link). */
  pdf: string;
  /** Optional public verification URL. */
  verifyUrl?: string;
};
