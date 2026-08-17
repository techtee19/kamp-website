// Seed content for the five events that predate the CMS. Sanity is the source of
// truth for the Events pages now — editing this file no longer changes the site.
// It is kept as the input to `npm run migrate:events`, which is idempotent, so a
// fresh dataset can be repopulated from here.
export type KampEvent = {
  slug: string
  title: string
  date: string
  time: string
  university: string
  location: string
  theme: string
  status: 'upcoming' | 'past'
  image: string
  description: string
  registrationClosed?: boolean
}

export const kampEvents: KampEvent[] = [
  {
    slug: 'emerge-2026',
    title: 'Emerge 2026',
    date: 'October 24, 2026',
    time: '9:00 AM',
    university: 'University of Ibadan',
    location: 'Trenchard Hall, University of Ibadan',
    theme: 'Rise into your purpose',
    status: 'upcoming',
    image: '/images/gallery/kamp-gallery/DSC06240.jpg',
    description:
      'Emerge is KAMP’s signature gathering for students ready to turn potential into practical leadership. Expect honest conversations, meaningful connections, and the tools to lead with purpose on campus and beyond.',
  },
  {
    slug: 'campus-leadership-forum',
    title: 'Campus Leadership Forum',
    date: 'November 8, 2026',
    time: '10:00 AM',
    university: 'LAUTECH',
    location: 'Great Hall, LAUTECH',
    theme: 'Leading where you are',
    status: 'upcoming',
    image: '/images/gallery/kamp-gallery/DSC06037.jpg',
    description:
      'A focused day for student leaders, builders, and changemakers to sharpen their leadership voice and leave with a clear plan for positive campus impact.',
    registrationClosed: true,
  },
  {
    slug: 'the-new-conference-2026',
    title: 'The New Conference',
    date: 'December 6, 2026',
    time: '9:30 AM',
    university: 'Federal University of Agriculture, Abeokuta',
    location: 'Ceremonial Building, FUNAAB',
    theme: 'The future is built together',
    status: 'upcoming',
    image: '/images/gallery/kamp-gallery/DSC06469.jpg',
    description:
      'The New Conference brings students, mentors, and community builders into one room to explore courageous leadership, collaboration, and the next chapter of campus impact.',
  },
  {
    slug: 'emerge-2025',
    title: 'Emerge 2025',
    date: 'October 19, 2025',
    time: '9:00 AM',
    university: 'University of Ibadan',
    location: 'Trenchard Hall, University of Ibadan',
    theme: 'Rise into your purpose',
    status: 'past',
    image: '/images/gallery/kamp-gallery/DSC06118.jpg',
    description:
      'A full day of insight, connection, and practical leadership conversations for students committed to making a difference.',
  },
  {
    slug: 'mentors-roundtable-2025',
    title: 'Mentors Roundtable',
    date: 'July 12, 2025',
    time: '11:00 AM',
    university: 'University of Lagos',
    location: 'J.F. Ade Ajayi Auditorium, UNILAG',
    theme: 'Conversations that shape leaders',
    status: 'past',
    image: '/images/gallery/kamp-gallery/DSC05771.jpg',
    description:
      'Mentors and students came together for practical conversations on navigating purpose, work, and meaningful community contribution.',
  },
]
