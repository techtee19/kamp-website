import institutionsData from '../public/data/institutions.json' with { type: 'json' }

export function institutionKey(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[.'’‘]/g, '').replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ')
}

const names = new Map<string, string | null>()
function register(alias: string, canonical: string) {
  const key = institutionKey(alias)
  if (!names.has(key)) names.set(key, canonical)
  else if (names.get(key) !== canonical) names.set(key, null)
}

for (const institution of institutionsData.institutions) register(institution.name, institution.name)

// Reviewed aliases only. Similar names and shared acronyms must not merge
// unrelated schools, campuses, universities, or colleges.
const aliases = [
  {
    name: 'Federal University of Agriculture, Abeokuta',
    values: ['FUNAAB', 'FUUNAB', 'Federal University of Agricultural Science Abeokuta'],
  },
  {
    name: 'Federal University of Petroleum Resources, Effurun',
    values: ['FUPRE', 'Federal University of Petroleum Resources Effurun Delta', 'Federal University of Petroleum Resources Effurun Delta State'],
  },
  {
    name: 'Ladoke Akintola University of Technology, Ogbomoso',
    values: ['LAUTECH', 'Ladoke Akintola University of Technology', 'Ladoke Akinotola University of Technology'],
  },
  { name: 'University of Lagos', values: ['UNILAG', 'College of Medicine University of Lagos'] },
  { name: 'University of Ibadan', values: ['UI'] },
  { name: 'University of Ilorin', values: ['UNILORIN'] },
  { name: 'University of Benin', values: ['UNIBEN'] },
  { name: 'University of Abuja, Gwagwalada', values: ['UNIABUJA', 'University of Abuja'] },
] as const

for (const group of aliases) {
  if (names.get(institutionKey(group.name)) !== group.name) throw new Error('Institution alias target is missing from the directory')
  for (const alias of group.values) {
    register(alias, group.name)
    if (/^[A-Z]+$/.test(alias)) {
      register(group.name + ' ' + alias, group.name)
      register(alias + ' ' + group.name, group.name)
    }
  }
}

export function canonicalInstitution(value: string) {
  const canonical = names.get(institutionKey(value))
  const name = canonical ?? value.normalize('NFKC').trim().replace(/\s+/g, ' ')
  return { name, key: institutionKey(name), recognized: Boolean(canonical) }
}
