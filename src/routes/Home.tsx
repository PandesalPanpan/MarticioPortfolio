import { Hero } from '@/sections/Hero';
import { Now } from '@/sections/Now';
import { Background } from '@/sections/Background';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';
import { Certifications } from '@/sections/Certifications';
import { Contact } from '@/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Now />
      <Background />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
    </>
  );
}
