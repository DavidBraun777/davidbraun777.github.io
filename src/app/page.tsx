import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { CurrentlyBuilding } from '@/components/sections/currently-building'
import { Experience } from '@/components/sections/experience'
import { Education } from '@/components/sections/education'
import { Projects } from '@/components/sections/projects'
import { Skills } from '@/components/sections/skills'
import { Testimonials } from '@/components/sections/testimonials'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CurrentlyBuilding />
      <Experience />
      <Education />
      <Projects />
      <Skills />
      <Testimonials />
      <Contact />
    </>
  )
}
