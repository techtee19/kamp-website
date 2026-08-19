'use client'

// Scroll-driven audience selector with a touch-friendly mobile layout.
import { useEffect, useRef, useState } from 'react'

const tabs = [
  {
    label: 'Students',
    action: 'Apply',
    copy: "You don't have to figure it out alone. KAMP connects Nigerian university students with mentors, peers, and programs designed to sharpen your leadership, clarify your direction, and push you further than you'd go on your own. Whether you're in your first year or your final semester, there's a place for you here. Show up, get involved, and start leading now not later.",
  },
  {
    label: 'Universities',
    action: 'Host KAMP',
    copy: 'Your students are ready to lead KAMP helps them get there. We partner with universities across Nigeria to bring our flagship mentorship conferences directly to your campus, at no cost to your institution. Past host universities have seen measurable improvements in student engagement, career clarity, and community involvement. Bring KAMP to your campus and invest in the generation your community is counting on.',
  },
  {
    label: 'Volunteers/Mentors',
    action: 'Become a Mentor',
    copy: "You've done the work, learned the lessons, and built something worth sharing. KAMP connects experienced professionals and emerging leaders with students who need exactly what you have not a lecture, but a real conversation with someone who has been where they are. Join our network of mentors and show up for the next generation the way someone once showed up for you.",
  },
  {
    label: 'Sponsors',
    action: 'Partner With Us',
    copy: 'Every KAMP conference reaches hundreds of students who are actively shaping the future of their communities. Sponsoring KAMP puts your organisation at the centre of that moment visible, relevant, and aligned with the kind of impact that outlasts a campaign. Partner with us to fund programs, sponsor events, or support community projects across Nigerian campuses.',
  },
]

export default function GetInvolvedTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const [scenePosition, setScenePosition] = useState<'before' | 'pinned' | 'after'>('before')
  const scrollSectionRef = useRef<HTMLDivElement>(null)
  const active = tabs[activeTab]

  // Only the desktop scene is scroll-driven; on mobile the tabs are tapped, so
  // the section is `md:block` and this bails out while it is hidden.
  useEffect(() => {
    let frame = 0

    const updateActiveTab = () => {
      const section = scrollSectionRef.current
      if (!section || section.offsetParent === null) return

      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const relativeScroll = window.scrollY - sectionTop
      const progress = Math.min(1, Math.max(0, relativeScroll / scrollDistance))

      setScenePosition(
        relativeScroll < 0 ? 'before' : relativeScroll > scrollDistance ? 'after' : 'pinned'
      )
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
      <section className="bg-brand-white pt-14 pb-10 md:hidden">
        <div className="container">
          <h2 className="font-display text-brand-ink text-[26px] leading-tight font-semibold">
            Take action and grow with <span className="text-[29px]">KAMP</span>
          </h2>
          <p className="text-brand-deep mt-3 max-w-xl text-[15px] leading-[1.35]">
            Whether you&apos;re a student looking for direction, a professional ready to give
            back, or a partner who believes in Africa&apos;s next generation — there&apos;s a
            place for you here.
          </p>
        </div>
      </section>

      {/* Mobile is a plain stacked section — tabs are tapped, not scrolled
          through — so the numbered row scrolls sideways past the right edge. */}
      <section className="bg-brand-gold pt-20 pb-15 md:hidden">
        <div className="container">
          <div className="-mr-5 flex scrollbar-none gap-7 overflow-x-auto pr-5 pb-1 [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`font-display shrink-0 text-[17px] whitespace-nowrap transition ${index === activeTab ? 'text-brand-ink font-semibold' : 'text-brand-ink/35'}`}
                aria-pressed={index === activeTab}
              >
                <span className="mr-2">{index + 1}.</span>
                {tab.label}
              </button>
            ))}
          </div>
          <div
            key={active.label}
            className="border-brand-ink/25 text-brand-deep mt-7 -mr-4 border-t pt-4 motion-safe:animate-[fade-in_250ms_ease-out]"
          >
            <p className="pr-4 text-[15px] leading-tight">{active.copy}</p>
            <p className="mt-14 pr-4 text-[15px] leading-tight">
              Get mentored, get connected, get moving on the leadership path you&apos;re
              already on.
            </p>
            <button
              type="button"
              className="bg-brand-ink text-brand-white mt-5 rounded-full px-6 py-2.5 text-sm"
            >
              {active.action}
            </button>
          </div>
        </div>
      </section>

      <div
        ref={scrollSectionRef}
        className="bg-brand-gold relative ml-[calc(50%-50vw)] hidden h-[360vh] w-screen md:block"
      >
        <div
          className={`${scenePosition === 'before' ? 'absolute inset-x-0 top-0' : scenePosition === 'after' ? 'hidden' : 'fixed inset-0 z-20'} bg-brand-white flex h-screen flex-col overflow-hidden`}
        >
          <div className="container max-w-[840px] shrink-0 px-6 pt-10 pb-6 md:px-0 xl:max-w-[1200px] xl:pt-16 xl:pb-8">
            <h2 className="font-display text-brand-ink text-[26px] leading-tight font-semibold">
              Take action and grow with KAMP
            </h2>
            <p className="text-brand-deep mt-4 max-w-3xl text-xs leading-[1.35] xl:max-w-[1000px]">
              Whether you&apos;re a student looking for direction, a professional ready to give
              back, or a partner who believes in Africa&apos;s next generation there&apos;s a
              place for you here.
            </p>
          </div>

          <div className="bg-brand-gold flex min-h-0 flex-1 items-center py-6 xl:py-8">
            <div className="container grid w-full max-w-[840px] gap-10 md:min-h-[208px] md:grid-cols-[342px_1fr] md:gap-24 xl:min-h-[360px] xl:max-w-[1440px] xl:grid-cols-[.9fr_1.1fr] xl:gap-16">
              <div className="border-brand-ink/35 md:border-r">
                <div className="flex flex-col items-start gap-4 xl:gap-5">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setActiveTab(index)}
                      className={`font-display text-left text-2xl transition xl:text-4xl ${index === activeTab ? 'text-brand-deep font-semibold' : 'text-brand-ink/45 hover:text-brand-ink'}`}
                      aria-pressed={index === activeTab}
                    >
                      <span className="mr-5 text-xl xl:text-3xl">{index + 1}.</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-brand-deep flex max-w-[350px] flex-col items-start justify-center xl:max-w-[650px]">
                <p className="text-sm leading-relaxed xl:text-base xl:leading-relaxed">
                  {active.copy}
                </p>
                <p className="mt-7 text-sm leading-relaxed xl:mt-9 xl:text-base xl:leading-relaxed">
                  Get mentored, get connected, get moving on the leadership path you&apos;re
                  already on.
                </p>
                <button
                  type="button"
                  className="bg-brand-ink text-brand-white mt-3 rounded-full px-5 py-2 text-xs xl:mt-5 xl:px-8 xl:py-3.5 xl:text-base"
                >
                  {active.action}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
