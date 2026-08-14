'use client'

// Scroll-driven audience selector with a touch-friendly mobile layout.
import { useEffect, useRef, useState } from 'react'

const tabs = [
  { label: 'Students', action: 'Apply', copy: "You don't have to figure it out alone. KAMP connects Nigerian university students with mentors, peers, and programs designed to sharpen your leadership, clarify your direction, and push you further than you'd go on your own. Whether you're in your first year or your final semester, there's a place for you here. Show up, get involved, and start leading now — not later." },
  { label: 'Universities', action: 'Host KAMP', copy: "Your students are ready to lead — KAMP helps them get there. We partner with universities across Nigeria to bring our flagship mentorship conferences directly to your campus, at no cost to your institution. Past host universities have seen measurable improvements in student engagement, career clarity, and community involvement. Bring KAMP to your campus and invest in the generation your community is counting on." },
  { label: 'Volunteers/Mentors', action: 'Become a Mentor', copy: "You've done the work, learned the lessons, and built something worth sharing. KAMP connects experienced professionals and emerging leaders with students who need exactly what you have — not a lecture, but a real conversation with someone who has been where they are. Join our network of mentors and show up for the next generation the way someone once showed up for you." },
  { label: 'Sponsors', action: 'Partner With Us', copy: "Every KAMP conference reaches hundreds of students who are actively shaping the future of their communities. Sponsoring KAMP puts your organisation at the centre of that moment — visible, relevant, and aligned with the kind of impact that outlasts a campaign. Partner with us to fund programs, sponsor events, or support community projects across Nigerian campuses." },
]

export default function GetInvolvedTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const scrollSectionRef = useRef<HTMLDivElement>(null)
  const active = tabs[activeTab]

  useEffect(() => {
    let frame = 0

    const updateActiveTab = () => {
      if (window.innerWidth < 768) return

      const section = scrollSectionRef.current
      if (!section) return

      const bounds = section.getBoundingClientRect()
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -bounds.top / scrollDistance))
      setActiveTab(Math.min(tabs.length - 1, Math.floor(progress * tabs.length)))
    }

    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActiveTab)
    }

    updateActiveTab()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <>
      <section className="bg-brand-white py-12 md:hidden">
        <div className="container">
          <h2 className="font-display text-[28px] font-semibold leading-tight text-brand-ink">Take action and grow with KAMP</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-deep">Whether you&apos;re a student looking for direction, a professional ready to give back, or a partner who believes in Africa&apos;s next generation — there&apos;s a place for you here.</p>
        </div>
      </section>

      <section className="bg-brand-gold py-10 md:hidden">
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
            {tabs.map((tab, index) => (
              <button key={tab.label} type="button" onClick={() => setActiveTab(index)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${index === activeTab ? 'border-brand-ink bg-brand-ink text-brand-white' : 'border-brand-ink/30 text-brand-ink'}`} aria-pressed={index === activeTab}>
                {index + 1}. {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-7 border-t border-brand-ink/25 pt-7 text-brand-deep">
            <p className="text-[15px] leading-relaxed">{active.copy}</p>
            <p className="mt-6 text-[15px] leading-relaxed">Get mentored, get connected, get moving on the leadership path you&apos;re already on.</p>
            <button type="button" className="mt-5 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-brand-white">{active.action}</button>
          </div>
        </div>
      </section>

      <div ref={scrollSectionRef} className="relative left-1/2 hidden h-[360vh] w-screen -translate-x-1/2 md:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-brand-white">
          <div className="container shrink-0 max-w-[840px] px-6 pb-6 pt-10 md:px-0 xl:max-w-[1200px] xl:pb-8 xl:pt-16">
            <h2 className="font-display text-[26px] font-semibold leading-tight text-brand-ink">Take action and grow with KAMP</h2>
            <p className="mt-4 max-w-3xl text-xs leading-[1.35] text-brand-deep xl:max-w-[1000px]">Whether you&apos;re a student looking for direction, a professional ready to give back, or a partner who believes in Africa&apos;s next generation — there&apos;s a place for you here.</p>
          </div>

          <div className="flex min-h-0 flex-1 items-center bg-brand-gold py-8 xl:py-12">
            <div className="container grid w-full max-w-[840px] gap-10 md:min-h-[208px] md:grid-cols-[342px_1fr] md:gap-24 xl:min-h-[300px] xl:max-w-[1200px] xl:grid-cols-[1fr_1fr] xl:gap-10">
              <div className="border-brand-ink/35 md:border-r">
                <div className="flex flex-col items-start gap-4">
                  {tabs.map((tab, index) => (
                    <button key={tab.label} type="button" onClick={() => setActiveTab(index)} className={`font-display text-left text-2xl transition xl:text-3xl ${index === activeTab ? 'font-semibold text-brand-deep' : 'text-brand-ink/45 hover:text-brand-ink'}`} aria-pressed={index === activeTab}>
                      <span className="mr-5 text-xl xl:text-2xl">{index + 1}.</span>{tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex max-w-[350px] flex-col items-start justify-center text-brand-deep xl:max-w-[520px]">
                <p className="text-xs leading-[1.15rem] xl:text-base xl:leading-relaxed">{active.copy}</p>
                <p className="mt-7 text-xs leading-[1.15rem] xl:mt-10 xl:text-base xl:leading-relaxed">Get mentored, get connected, get moving on the leadership path you&apos;re already on.</p>
                <button type="button" className="mt-3 rounded-full bg-brand-ink px-5 py-2 text-xs text-brand-white xl:mt-5 xl:px-7 xl:py-3 xl:text-sm">{active.action}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
