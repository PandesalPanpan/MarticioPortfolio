import { Hero } from '@/sections/Hero';
import { Projects } from '@/sections/Projects';
import { Experience } from '@/sections/Experience';
import { Education } from '@/sections/Education';
import { Contact } from '@/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}
