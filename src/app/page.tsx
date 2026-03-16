import { Hero } from '@/components/sections/hero'
import { WhatIBuild } from '@/components/sections/what-i-build'
import { SelectedSystems } from '@/components/sections/selected-systems'
import { HowIBuild } from '@/components/sections/how-i-build'
import { EngineeringPrinciples } from '@/components/sections/engineering-principles'
import { CurrentInterests } from '@/components/sections/current-interests'
import { HomeBlog } from '@/components/sections/home-blog'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <Hero />
      <WhatIBuild />
      <SelectedSystems />
      <HowIBuild />
      <EngineeringPrinciples />
      <CurrentInterests />
      <HomeBlog />
      <Contact />
    </>
  )
}
