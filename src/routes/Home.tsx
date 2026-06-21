import { Hero } from '@/sections/Hero';
import { Experience } from '@/sections/Experience';
import { Skills } from '@/sections/Skills';
import { Projects } from '@/sections/Projects';
import { Education } from '@/sections/Education';
import { Certifications } from '@/sections/Certifications';
import { Contact } from '@/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Certifications />
      <Contact />
    </>
  );
}
