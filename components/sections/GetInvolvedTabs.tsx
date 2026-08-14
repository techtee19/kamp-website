'use client'

// Interactive audience tabs for the get-involved section.
import { useState } from 'react'

const tabs = [
  { label: 'Students', action: 'Apply', copy: "You don't have to figure it out alone. KAMP connects Nigerian university students with mentors, peers, and programs designed to sharpen your leadership, clarify your direction, and push you further than you'd go on your own. Whether you're in your first year or your final semester, there's a place for you here. Show up, get involved, and start leading now — not later." },
  { label: 'Universities', action: 'Host KAMP', copy: "Your students are ready to lead — KAMP helps them get there. We partner with universities across Nigeria to bring our flagship mentorship conferences directly to your campus, at no cost to your institution. Past host universities have seen measurable improvements in student engagement, career clarity, and community involvement. Bring KAMP to your campus and invest in the generation your community is counting on." },
  { label: 'Volunteers/Mentors', action: 'Become a Mentor', copy: "You've done the work, learned the lessons, and built something worth sharing. KAMP connects experienced professionals and emerging leaders with students who need exactly what you have — not a lecture, but a real conversation with someone who has been where they are. Join our network of mentors and show up for the next generation the way someone once showed up for you." },
  { label: 'Sponsors', action: 'Partner With Us', copy: "Every KAMP conference reaches hundreds of students who are actively shaping the future of their communities. Sponsoring KAMP puts your organisation at the centre of that moment — visible, relevant, and aligned with the kind of impact that outlasts a campaign. Partner with us to fund programs, sponsor events, or support community projects across Nigerian campuses." },
]

export default function GetInvolvedTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const active = tabs[activeTab]

  return (
    <div className="mt-10 bg-brand-gold/25 px-6 py-12 sm:px-10 lg:mt-14 lg:px-16 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div className="border-brand-black/35 lg:border-r lg:pr-16">
          <div className="flex flex-col items-start gap-4">
            {tabs.map((tab, index) => (
              <button key={tab.label} type="button" onClick={() => setActiveTab(index)} className={`font-display text-left text-3xl transition sm:text-4xl ${index === activeTab ? 'font-bold text-brand-black' : 'text-brand-grey/55 hover:text-brand-grey'}`} aria-pressed={index === activeTab}>
                <span className="mr-5 text-2xl sm:text-3xl">{index + 1}.</span>{tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex max-w-xl flex-col items-start justify-center">
          <p className="text-base leading-relaxed text-brand-black/85">{active.copy}</p>
          <p className="mt-8 text-base leading-relaxed text-brand-black">Get mentored, get connected, get moving on the leadership path you&apos;re already on.</p>
          <button type="button" className="mt-5 rounded-full bg-brand-black px-6 py-2.5 text-sm text-brand-white">{active.action}</button>
        </div>
      </div>
    </div>
  )
}
