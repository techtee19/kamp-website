import universitiesData from '@/public/data/universities.json'

export interface NigerianUniversity {
  name: string
  type: 'Federal' | 'State' | 'Private'
  state: string
  abbreviation: string
}

// TS widens string literals in imported JSON to `string`, so `type` needs the
// assertion. Verified safe: all 273 entries use only Federal/State/Private.
export const NIGERIAN_UNIVERSITIES = universitiesData.universities as NigerianUniversity[]

// Just the names — for the autocomplete search
export const UNIVERSITY_NAMES: string[] = universitiesData.universities
  .map((u) => u.name)
  .sort()
