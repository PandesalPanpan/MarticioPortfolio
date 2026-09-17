import { Hero } from '@/sections/Hero';
import { InventoryDemo } from '@/sections/InventoryDemo';
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
      <InventoryDemo />
      <Background />
      <Now />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
    </>
  );
}
