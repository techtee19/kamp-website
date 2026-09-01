'use client'

// Self-advancing audience selector.
//
// The section sits in normal page flow and cycles through the tabs on a timer,
// fading the panel in on each change. Rotation only runs while the section is on
// screen, and any click restarts the countdown from the tab just picked. Mobile
// and desktop keep their own layouts but share the one active tab.
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

const AUTOPLAY_MS = 6000

export default function GetInvolvedTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const [isOnScreen, setIsOnScreen] = useState(false)
  const mobileSceneRef = useRef<HTMLDivElement>(null)
  const desktopSceneRef = useRef<HTMLDivElement>(null)
  const mobileTabsRowRef = useRef<HTMLDivElement>(null)
  const active = tabs[activeTab]

  // Only one layout is rendered at a time; the hidden one has no box, so it
  // never reports as intersecting and drops out of the count on its own.
  useEffect(() => {
    const scenes = [mobileSceneRef.current, desktopSceneRef.current].filter(
      (scene): scene is HTMLDivElement => scene !== null
    )
    if (!scenes.length) return

    const onScreen = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target)
          else onScreen.delete(entry.target)
        }
        setIsOnScreen(onScreen.size > 0)
      },
      { threshold: 0.35 }
    )

    scenes.forEach((scene) => observer.observe(scene))
    return () => observer.disconnect()
  }, [])

  // `activeTab` in the deps is deliberate: picking a tab by hand restarts the
  // countdown instead of cutting a manual choice short.
  useEffect(() => {
    if (!isOnScreen) return

    const timer = window.setTimeout(
      () => setActiveTab((current) => (current + 1) % tabs.length),
      AUTOPLAY_MS
    )

    return () => window.clearTimeout(timer)
  }, [isOnScreen, activeTab])

  // The mobile numbered row is wider than the screen, so bring the tab that just
  // became active into view.
  useEffect(() => {
    const row = mobileTabsRowRef.current
    if (!row || row.offsetParent === null) return

    const tab = row.children[activeTab]
    if (!(tab instanceof HTMLElement)) return

    const rowBox = row.getBoundingClientRect()
    const tabBox = tab.getBoundingClientRect()

    row.scrollBy({
      left: tabBox.left - rowBox.left - (rowBox.width - tabBox.width) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }, [activeTab])

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

      {/* Mobile keeps the stacked layout: the numbered row scrolls sideways past
          the right edge and follows the tab that is currently active. */}
      <div ref={mobileSceneRef} className="bg-brand-gold overflow-hidden py-12 md:hidden">
        <div className="container">
          <div
            ref={mobileTabsRowRef}
            className="-mr-5 flex scrollbar-none gap-7 overflow-x-auto pr-5 pb-1 [&::-webkit-scrollbar]:hidden"
          >
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
          {/* The floor keeps all four tabs the same height, so the panel holds
              still as the rotation advances. */}
          <div
            key={active.label}
            className="border-brand-ink/25 text-brand-deep mt-7 -mr-4 min-h-84 border-t pt-4 motion-safe:animate-[fade-in_400ms_ease-out]"
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
      </div>

      <div
        ref={desktopSceneRef}
        className="bg-brand-white ml-[calc(50%-50vw)] hidden w-screen overflow-hidden md:block"
      >
        <div className="container max-w-[840px] px-6 pt-10 pb-6 md:px-0 xl:max-w-[1200px] xl:pt-16 xl:pb-8">
          <h2 className="font-display text-brand-ink text-[26px] leading-tight font-semibold">
            Take action and grow with KAMP
          </h2>
          <p className="text-brand-deep mt-4 max-w-3xl text-xs leading-[1.35] xl:max-w-[1000px]">
            Whether you&apos;re a student looking for direction, a professional ready to give
            back, or a partner who believes in Africa&apos;s next generation there&apos;s a
            place for you here.
          </p>
        </div>

        <div className="bg-brand-gold flex items-center py-16 xl:py-24">
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

            <div
              key={active.label}
              className="text-brand-deep flex max-w-[350px] flex-col items-start justify-center motion-safe:animate-[fade-in_400ms_ease-out] xl:max-w-[650px]"
            >
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
    </>
  )
}
