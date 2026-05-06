export type BuildStyle = 'ai-assisted' | 'from-scratch';

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
  images?: string[];
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
};
