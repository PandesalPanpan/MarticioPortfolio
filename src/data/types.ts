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
  tech: string[];
  buildStyle: BuildStyle;
  links: { live?: string; code?: string };
  featured: boolean;
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
  /** Imported full-resolution image shown in the lightbox. */
  image: string;
  /** Imported thumbnail image shown on the card. */
  thumb: string;
  /** Path to the original PDF in /public (download link). */
  pdf: string;
  /** Optional public verification URL. */
  verifyUrl?: string;
};
