import { Hero } from '@/sections/Hero';
import { Services } from '@/sections/Services';
import { Proof } from '@/sections/Proof';
import { Projects } from '@/sections/Projects';
import { Experience } from '@/sections/Experience';
import { Skills } from '@/sections/Skills';
import { WhyMe } from '@/sections/WhyMe';
import { FitCheck } from '@/sections/FitCheck';
import { Education } from '@/sections/Education';
import { Certifications } from '@/sections/Certifications';
import { FinalCta } from '@/sections/FinalCta';
import { Contact } from '@/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Proof />
      <Projects />
      <Experience />
      <Skills />
      <WhyMe />
      <FitCheck />
      <Education />
      <Certifications />
      <FinalCta />
      <Contact />
    </>
  );
}
